<template>
	<section id="content" class="box columns is-multiline">
		<div class="column is-8">
			<b-field label="Select Date">
				<b-datepicker
					placeholder="Click to select..."
					icon="calendar-today"
					:min-date="minDate"
					v-model="date"
					rounded>
				</b-datepicker>
			</b-field>

			<div class="columns">
				<div class="column is-half">
					<b-field label='Select Station'>
						<b-select expanded placeholder='Select Station' v-model="stationId" @forminput="reset" rounded>
							<option v-for="station in stationList" :value="station.station_id" :key="station.station_name">
								{{station.station_name}}
							</option>
						</b-select>
					</b-field>
				</div>

				<div class="column is-half">
					<b-field label='Select Role'>
						<b-select expanded placeholder='Select Role' v-model="roleId" @input="getSessionList" rounded>
							<option disabled>Please select a station first</option>
							<option v-for="role in filterRoles" :value="role.role_id" :key="role.role_name">
								{{ role.role_name }}
							</option>
						</b-select>
					</b-field>
				</div>
			</div>

			<div class="columns">
				<div class="column is-half">
					<b-field label='Reserve From'>
						<b-select expanded placeholder="Reserve From" v-model="session_id" rounded>
							<option disabled selected>Please select a role first</option>
							<option v-for="start in sessionList" :value="start.session_id" :key="start.session_start">
								{{ start.session_start.slice(0, 5) }}
							</option>
						</b-select>
					</b-field>
				</div>

				<div class="column is-half">
					<b-field label='Reserve To'>
						<b-select expanded placeholder="Reserve To" v-model="end" disabled rounded>
							<option disabled selected>Please select a role first</option>
							<option v-if="session_id && filterEnd !== undefined">{{ filterEnd.session_end.slice(0,5) }}</option>
						</b-select>
					</b-field>
				</div>
			</div>

			<b-field label='No. Of Reserved Slots'>
				<b-select expanded placeholder="No. Of Slots To Reserve" v-model="noOfRSlots" rounded>
					<option disabled selected>Please select role and session first</option>
					<option v-for="i in maxCap" :key="i" :value="i">{{ i }}</option>
				</b-select>
			</b-field>

			<b-field label="Remarks" :type="errors.has('remarks') ? 'is-danger': ''"
				:message="errors.has('remarks') ? errors.first('remarks') : ''">
				<b-input maxlength="500" type="textarea" name="remarks" v-validate="'required'"
				data-vv-as="'Remarks'" v-model="remarks"></b-input>
			</b-field>

			<div class="grouped-button is-clearfix">
				<button class="button is-success is-pulled-right" :disabled="isDisabled"
				@click="validateBeforeSubmit()">Save Changes</button>
				<router-link to="/Admin/Reservations/"
				class="button is-light is-pulled-right right-spaced">Cancel</router-link>
			</div>
		</div>
	</section>
</template>

<script>
import DataModel from '~/models/dataModel.js'
import moment from 'moment'
import config from '~/config.js'

export default {
	data() {
		const today = new Date()
		return {
			roleList: [],
			roleId: null,
			stationId: null,
			stationList: null,
			sessionList: null,
			session_id: null,
			end: null,
			noOfRSlots: null,
			remarks: '',
			maxCap: 0,
			minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
			date: null,
			origData: null
		}
	},
	async mounted() {
		this.$store.commit('setPageTitle', 'Edit Reservation')
		let res = await this.$axios.get(`http://${config.serverURL}/roles/`)
		this.roleList = res.data[0]
		this.stationList = res.data[1]

		res = await this.$axios.get(`http://${config.serverURL}/reservations/${this.$route.params.id}`)
		this.origData = res.data[0]
		this.stationId = this.origData.station_id
		this.roleId = this.origData.role_id

		this.date = new Date(this.origData.session_date)
		this.session_id = this.origData.session_id
		this.remarks = this.origData.remarks
		this.noOfRSlots = this.origData.noOfReservedSlots
	},
	methods: {
		submit() {
			let session = this.sessionList.find(i => i.session_id === this.session_id)
			let date = moment(this.date).format('YYYY-MM-DD')
			let roleName = this.roleList.find(i => i.role_id === this.roleId).role_name
			let webFormData = new DataModel.Reservation(date, this.roleId, this.session_id, this.noOfRSlots, this.remarks)

			this.$axios.put(`http://${config.serverURL}/reservations/${this.$route.params.id}`, webFormData)
			.then(res => {
				if (res.status === 200) {
					this.$dialog.alert({
						title: 'Change Reservation',
						message: `Reservation has been successfully changed for the role \'${roleName}\'
						from ${session.session_start} to ${session.session_end}.`,
						type: 'is-success',
						hasIcon: true,
						icon: 'check-circle',
						iconPack: 'mdi',
						onConfirm: () => this.$router.push('/Admin/Reservations')
					})
				}
			})
			.catch(err => {
				if (err.response.data.message) {
					this.$dialog.alert({
						title: 'Error',
						message: `${err.response.data.message}`,
						type: 'is-danger',
						hasIcon: true
					})
				}
			})
		},
		async getSessionList() {
			let res = await this.$axios.get(`http://${config.serverURL}/reservations/getSessionList/${this.roleId}`)
			this.sessionList = res.data
			this.maxCap = this.sessionList[0].capacity
			// this.session_id = null
			// this.noOfRSlots = null
		},
		validateBeforeSubmit() {
			this.$validator.validateAll().then(res => {
				if (res) {
					this.submit()
				}
			})
		},
		reset() {
			if (this.roleId) {
				this.roleId = null
				this.session_id = null
				this.noOfRSlots = null
			}
		}
	},
	computed: {
		isDisabled() {
			if (this.origData) {
				return (this.origData.session_id === this.session_id
				&& moment(new Date(this.origData.session_date), 'YYYY-MM-DD').diff(moment(this.date, 'YYYY-MM-DD'), 'days') === 0
				&& this.origData.role_id === this.roleId && this.origData.station_id === this.stationId
				&& this.noOfRSlots === this.origData.noOfReservedSlots && this.origData.remarks === this.remarks) ||
				!this.session_id || !this.date || !this.roleId || !this.stationId || !this.noOfRSlots || !this.remarks
			}
		},
		filterRoles() {
			if (this.stationId) {
				return this.roleList.filter(i => i.station_id === this.stationId)
			}
		},
		filterEnd() {
			if (this.session_id) {
				for (let i in this.sessionList) {
					if (this.session_id === this.sessionList[i].session_id) {
						this.end = this.sessionList[i].session_end.slice(0, 5)
						return this.sessionList[i]
					}
				}
			}
			else {
				this.end = null
				return undefined
			}
		}
	}
}
</script>

<style scoped>
.right-spaced {
  margin-right: 1.5vw;
}
.grouped-button {
	margin-bottom: 3vh;
}
</style>
