<template>
	<section id="content" class="box columns is-multiline">
		<div class="column is-9">
		<b-field label="Select Date*">
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
				<b-field label='Select Station*' :type="errors.has('station') ? 'is-danger': ''"
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
				<b-field label='Select Role*' :type="errors.has('role') ? 'is-danger': ''"
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
      <b-input maxlength="100" type="textarea" name="remarks" v-validate.immediate="'required'"
      data-vv-as="'Remarks'" v-model="remarks"></b-input>
    </b-field>
		
		<br/>
		<button class="button is-success" :disabled="isDisabled" @click="submit()">Make Reservation</button>
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
			date: new Date()
		}
	},
	async beforeMount() {
		this.$store.commit('setPageTitle', 'Make Reservation')

		let res = await this.$axios.get(`http://${config.serverURL}/roles/`)
		this.roleList = res.data[0]
		this.stationList = res.data[1]
	},
	methods: {
		submit() {
			let reservedFrom = moment(this.start, 'HH:mm').format('HH:mm')
			let reservedTo = moment(this.end, 'HH:mm').format('HH:mm')
			let date = moment(this.date).format('YYYY-MM-DD')
			let roleName = this.roleList.find(i => i.role_id === this.roleId).role_name
			let webFormData = new DataModel.Reservation(date, this.stationId, this.roleId,
				reservedFrom, reservedTo, this.remarks)

			this.$axios.post(`http://${config.serverURL}/reservations/`, webFormData)
			.then(res => {
				if (res.status === 200) {
					this.$dialog.confirm({
						title: 'Reservation',
						message: `A new reservation on \'${date}\' has been made for the role \'${roleName}\'
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
						message: `Error! ${err.response.data.message}`,
						type: 'is-danger',
						hasIcon: true
					})
				}
			})
		},
		async getSessionList() {
			let res = await this.$axios.get(`http://${config.serverURL}/reservations/getSessionList/${this.roleId}`)
			this.sessionList = res.data
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
			if (this.start) {
				return this.sessionList.filter(i => moment(i.session_end, 'HH:mm').isAfter(moment(this.start, 'HH:mm')))
			}
			return this.sessionList
		}
	}
}
</script>
