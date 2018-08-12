<template>
	<section id="content" class="box columns is-multiline">
		<div class="column is-7">
			<b-field label="Select Date">
				<b-datepicker
					placeholder="Click to select..."
					icon="calendar-today"
					:min-date="minDate"
					v-model="date"
					rounded>
				</b-datepicker>
			</b-field>

			<b-field label='Select Station'>
				<b-input disabled v-model="stationName" rounded></b-input>
			</b-field>

			<b-field label='Select Role'>
				<b-input disabled v-model="roleName" rounded></b-input>
			</b-field>

			<b-field grouped>
				<b-field label='Set Limit'>
					<b-select v-model='limit' placeholder='Select Limit' rounded required>
						<option v-for="i in 11" :key="i">{{ i-1 }}</option>
					</b-select>
				</b-field>
			</b-field>

			<br/>
			<button class="button is-success is-pulled-right" :disabled="isDisabled" @click="validateBeforeSubmit()">Save Changes</button>
			<router-link to="/Admin/Limit/"
			class="button is-light is-pulled-right right-spaced">Cancel</router-link>
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
			roleName: null,
			roleId: null,
			limit: null,
			stationName: null,
			stationId: null,
			stationList: null,
			minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
			date: new Date(),
			origData: null
		}
	},
	async mounted() {
		this.$store.commit('setPageTitle', 'Edit Limit')

		let res = await this.$axios.get(`http://${config.serverURL}/limit/${this.$route.params['id']}`)
		this.origData = res.data[0]
		this.roleId = this.origData.role_id
		this.roleName = this.origData.role_name
		this.stationName = this.origData.station_name
		this.stationId = this.origData.station_id
		this.date = new Date(this.origData.session_date)
		this.limit = this.origData.booking_limit
	},
	methods: {
		submit() {
			let date = moment(this.date).format('YYYY-MM-DD')
			let webFormData = new DataModel.Limit(this.stationId, this.roleId,
				date, this.limit)

			this.$axios.put(`http://${config.serverURL}/limit/${this.$route.params['id']}`, webFormData)
			.then(res => {
				if (res.status === 200) {
					this.$dialog.alert({
						title: 'Set Limit',
						message: `Limit has been updated for <b>${this.roleName}</b>`,
						type: 'is-success',
						hasIcon: true,
						icon: 'check-circle',
						iconPack: 'mdi'
					})
				}
			})
			.catch(err => {
				this.$dialog.alert({
					title: 'Error',
					message: `A limit has already been set for <b>${this.roleName}</b> on <b>${date}</b>`,
					type: 'is-danger',
					hasIcon: true
				})
			})
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
			if (this.origData) {
				return (moment(new Date(this.origData.session_date), 'YYYY-MM-DD').diff(moment(this.date, 'YYYY-MM-DD'), 'days') === 0
				&& this.origData.booking_limit === this.limit) ||
				!this.limit || !this.date || !this.roleId || !this.stationId
			}
		}
	}
}
</script>

<style scoped>
.right-spaced {
  margin-right: 1.5vw;
}
</style>
