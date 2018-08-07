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
					<b-field label='Select Station' :type="errors.has('station') ? 'is-danger': ''"
						:message="errors.has('station') ? errors.first('station') : ''">
						<b-select expanded placeholder='Select Station' v-model="stationId"
							name="station" v-validate="'required'" data-vv-as="'Station'" rounded>
							<option v-for="station in stationList" :value="station.station_id" :key="station.station_name">
								{{station.station_name}}
							</option>
						</b-select>
					</b-field>
				</div>

				<div class="column is-half">
					<b-field label='Select Role' :type="errors.has('role') ? 'is-danger': ''"
						:message="errors.has('role') ? errors.first('role') : ''">
						<b-select expanded placeholder='Select Role' v-model="roleId"
							name="role" v-validate="'required'" data-vv-as="'Role'" @input="getSessionList" rounded>
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
						<b-select expanded placeholder="Reserve From" v-model="start" rounded>
							<option v-for="start in sessionList" :value="start.session_start" :key="start.session_start">
								{{ start.session_start.slice(0, 5) }}
							</option>
						</b-select>
					</b-field>
				</div>

				<div class="column is-half">
					<b-field label='Reserve To'>
						<b-select expanded placeholder="Reserve To" v-model="end" rounded>
							<option v-for="end in filterEnd" :value="end.session_end" :key="end.session_end">
								{{ end.session_end.slice(0, 5) }}
							</option>
						</b-select>
					</b-field>
				</div>
			</div>

			<b-field label="Remarks" :type="errors.has('remarks') ? 'is-danger': ''"
				:message="errors.has('remarks') ? errors.first('remarks') : ''">
				<b-input maxlength="500" type="textarea" name="remarks" v-validate="'required'"
				data-vv-as="'Remarks'" v-model="remarks"></b-input>
			</b-field>
			
			<div class="grouped-button is-clearfix">
				<button class="button is-success is-pulled-right" :disabled="isDisabled" 
				@click="validateBeforeSubmit()">Submit</button>
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
			start: null,
			end: null,
			remarks: '',
			minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
			date: null
		}
	},
	async mounted() {
		this.$store.commit('setPageTitle', 'Change Reservation')
		let res = await this.$axios.get(`http://${config.serverURL}/roles/`)
		this.roleList = res.data[0]
		this.stationList = res.data[1]

		res = await this.$axios.get(`http://${config.serverURL}/reservations/${this.$route.params.id}`)
		this.stationId = res.data[0].station_id
		this.roleId = res.data[0].role_id

		this.date = new Date(res.data[0].session_date)
		this.start = res.data[0].reservedFrom
		this.end = res.data[0].reservedTo
		this.remarks = res.data[0].remarks
	},
	methods: {
		submit() {
			let reservedFrom = moment(this.start, 'HH:mm').format('HH:mm')
			let reservedTo = moment(this.end, 'HH:mm').format('HH:mm')
			let date = moment(this.date).format('YYYY-MM-DD')
			let roleName = this.roleList.find(i => i.role_id === this.roleId).role_name
			let webFormData = new DataModel.Reservation(date, this.stationId, this.roleId,
				reservedFrom, reservedTo, this.remarks)

			this.$axios.put(`http://${config.serverURL}/reservations/${this.$route.params.id}`, webFormData)
			.then(res => {
				if (res.status === 200) {
					this.$dialog.alert({
						title: 'Change Reservation',
						message: `Reservation has been successfully changed for the role \'${roleName}\'
						from ${reservedFrom} to ${reservedTo}.`,
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
			if (!this.sessionList) {
				let res = await this.$axios.get(`http://${config.serverURL}/reservations/getSessionList/${this.roleId}`)
				this.sessionList = res.data
			}
		},
		validateBeforeSubmit() {
			this.$validator.validateAll().then(res => {
				if (res) {
					this.submit()
				}
			})
		}
	},
	computed: {
		isDisabled() {
			return !this.start || !this.end || !this.date || !this.roleId || !this.stationId
		},
		filterRoles() {
			if (this.stationId) {
				return this.roleList.filter(i => i.station_id === this.stationId)
			}
		},
		filterStart() {
			if (this.end) {
				return this.sessionList.filter(i => moment(i.session_start, 'HH:mm').isBefore(moment(this.end, 'HH:mm')))
			}
			return this.sessionList
		},
		filterEnd() {
			if (this.start && this.sessionList) {
				return this.sessionList.filter(i => moment(i.session_end, 'HH:mm').isAfter(moment(this.start, 'HH:mm')))
			}
			return this.sessionList
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
