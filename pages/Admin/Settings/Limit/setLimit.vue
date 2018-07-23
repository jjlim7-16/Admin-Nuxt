<template>
	<section id="content" class="box" style="width: 46%">
		<b-field label='Select Role*' :type="errors.has('role') ? 'is-danger': ''" 
			:message="errors.has('role') ? errors.first('role') : ''">
			<b-select expanded placeholder='Select Role' v-model="roleId"
				name="role" v-validate="'required'" data-vv-as="'Role'">
				<option v-for="role in roleList" :value="role.role_id" :key="role.role_name">
					{{ role.role_name }}
				</option>
			</b-select>
		</b-field>

		<b-field label="Select Date">
			<b-datepicker
				placeholder="Click to select..."
				icon="calendar-today"
				:min-date="minDate"
				v-model="date">
			</b-datepicker>
    </b-field>

		<b-field grouped>
			<b-field label='Set Limit'>
				<b-select v-model='limit' placeholder='Select Limit' required>
					<option>1</option>
					<option>2</option>
					<option>3</option>
					<option>4</option>
				</b-select>
			</b-field>
		</b-field>

		<br/>
		<button class="button is-success" :disabled="isDisabled" @click="submit()">Set Limit</button>
	</section>
</template>

<script>
import axios from 'axios'
import DataModel from '../../../../models/dataModel.js'
import moment from 'moment'
import config from '~/config.js'

export default {
	data() {
		const today = new Date()
		return {
			roleList: [],
			roleId: null,
			limit: null,
			stationId: 0,
			minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
			date: new Date()
		}
	},
	beforeCreate() {
		this.$store.commit('setPageTitle', 'Set New Limit')
		
		axios.get(`http://${config.serverURL}/roles/`)
		.then((res) => {
			this.roleList = res.data[0]
		})
	},
	beforeMount() {
		if (this.$route.params['id']) {
			this.stationId = this.$route.params['id']
		}
	},
	computed: {
    // isDisabled() {
    //   return !this.roleName || !this.capacity || !this.files[0];
    // }
	},
	methods: {
		submit() {
			let stationId = this.roleList.find(i => i.role_id === this.roleId).station_id
			let roleName = this.roleList.find(i => i.role_id === this.roleId).role_name
			let date = moment(this.date).format('YYYY-MM-DD')
			let webFormData = new DataModel.Limit(stationId, this.roleId, 
				date, this.limit)
			
			axios.post(`http://${config.serverURL}/limit/`, webFormData)
			.then(res => {
				if (res.status === 200) {
					this.$dialog.alert({
						title: 'Set Limit',
						message: `A new limit has been set for the role \'${roleName}\' on \'${date}\'.`,
						type: 'is-success',
						hasIcon: true,
						icon: 'check-circle',
						iconPack: 'mdi'
					})
				}
			})
			.catch(err => {
				console.log(err)
			})
		}
	},
	computed: {
		isDisabled() {
			return this.limit === null
		}
	}
}
</script>
