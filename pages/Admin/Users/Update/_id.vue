<template>
	<section id="content" class="box columns is-multiline">
		<div class="column is-7">
			<b-field label='Station Name' v-show="account_type === 'Crew'">
				<b-select placeholder="Select a station"  v-model="account_type_id" disabled rounded>
					<option v-for="crewAccountType in crewAccountTypeList"
									:value="crewAccountType.account_type_id"
									:key="crewAccountType.account_type_id">
						{{crewAccountType.station_name}}
					</option>
				</b-select>
			</b-field>

			<b-field label='Username' :type="errors.has('username') ? 'is-danger': ''"
				:message="errors.has('username') ? errors.first('username') : ''">
				<b-input placeholder='Enter Username' v-model="username" name="username" data-vv-as="'username'"
					v-validate="'required|alpha_dash'" rounded></b-input>
			</b-field>

			<b-field label='New Password' :type="errors.has('password') ? 'is-danger': ''"
				:message="errors.has('password') ? errors.first('password') : ''">
				<b-input placeholder='Enter Password' v-model="password" name="password"
				type="password" v-validate="'required|min:8'" ref="password" rounded></b-input>
			</b-field>

			<b-field label='Confirm Password' :type="errors.has('confirmPassword') ? 'is-danger': ''"
				:message="errors.has('confirmPassword') ? errors.first('confirmPassword') : ''">
				<b-input placeholder='Confirm Password' type="password" v-model="confirmPassword"
				name="confirmPassword" v-validate="'required|min:8|confirmed:password'" data-vv-as="password" rounded></b-input>
			</b-field>

			<br/>
			<button class="button is-success is-pulled-right" :disabled="isDisabled"
			@click="validateBeforeSubmit()">Save Changes</button>
			<router-link to="/Admin/Users/" class="button is-light right-spaced is-pulled-right">Cancel</router-link>
		</div>
	</section>
</template>

<script>
import config from '~/config.js'
import DataModel from '~/models/dataModel.js'

export default {

	data(){
		return{
			crewAccountTypeList: [],
			username: '',
			password: '',
			confirmPassword: '',
			account_type: 'Admin',
			stationId: '',
			account_type_id: '',
			curruser: null
		}
	},
	async mounted() {
		this.$store.commit('setPageTitle', 'Edit User')
		try {
			let res = await this.$axios.get(`http://${config.serverURL}/user/${this.$route.params['id']}`)
			this.crewAccountTypeList.station_name = res.data[1]
			this.curruser = res.data[0]
			this.username = this.curruser.username
			this.account_type_id = this.curruser.account_type_id
			this.account_type = this.curruser.account_type
			this.stationId = this.curruser.station_id

			res = await this.$axios.get(`http://${config.serverURL}/user/getAccountTypeCrewList/`)
			this.crewAccountTypeList= res.data
			for (var i in this.data){
				if (this.data[i].account_type != 'Admin') {
					for (var a in this.crewAccountTypeList) {
						if (this.crewAccountTypeList[a].account_type==this.data[i]) {
							this.data[i].station_name = this.crewAccountTypeList[a].station_name
						}
					}
				} else {
					this.data[i].station_name = null
				}
			}
		} catch(err) {
			console.log(err)
		}
	},
	methods:{
		async submit(){
			let userExist = false
			if (this.curruser.username.toLowerCase() !== this.username.toLowerCase()) {
				let res = await this.$axios.get(`http://${config.serverURL}/user`)
				let userList = res.data
				for (let i in userList) {
					if ((userList[i].username.toLowerCase() === this.username.toLowerCase() &&
					userList[i].user_id != this.$route.params.id) || userList[i].account_type === 'Master Admin') {
						userExist = true
						break
					}
				}
			}
			if (userExist) {
				this.$dialog.alert({
					title: 'Error',
					message: `<b>${this.username}</b> already exists`,
					type: 'is-success',
					hasIcon: true,
					icon: 'check-circle',
					iconPack: 'mdi'
				})
			}
			else {
				// let webFormData = new DataModel.Account(this.account_type_id, this.username, this.password)
				let webFormData
				if (this.password !== '') {
					webFormData = new DataModel.Account(this.account_type_id, this.username, this.password)
				}
				this.$axios.put(`http://${config.serverURL}/user/`+ this.$route.params['id'], webFormData)
				.then(res => {
					if (res.status === 200) {
						this.$dialog.alert({
							title: 'Edit User',
							message: `<b>${this.username}</b> has been successfully edited`,
							type: 'is-success',
							hasIcon: true,
							icon: 'check-circle',
							iconPack: 'mdi',
							onConfirm: () => this.$router.go({path: '/Admin/Users', force: true})
						})
					}
				})
				.catch(err => {
					console.log(err)
				})
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
			if (this.curruser) {
				console.log(this.account_type_id)
				if (this.account_type === 'Crew') {
					return !this.username || !this.password || !this.confirmPassword || !this.account_type_id
				}
				else if (this.account_type === 'Admin') {
					return (!this.username || this.username === this.curruser.username) && (!this.password || !this.confirmPassword)
				}
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
