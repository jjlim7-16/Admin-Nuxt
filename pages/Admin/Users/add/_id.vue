<template>
	<section id="content" class="box columns is-multiline">
		<div class="column is-7">
			<div class="columns">
				<div class="column is-half">
					<b-field label='User Role'>
						<b-select placeholder="Select User Role" @input="getAccountTypeId" :disabled="isDisabled"
						v-model="account_type" expanded rounded>
							<option>Admin</option>
							<option>Crew</option>
						</b-select>
					</b-field>
				</div>

				<div class="column is-half">
					<b-field label='Station Name' v-show="account_type === 'Crew'">
						<b-select placeholder="Select a station" v-model="account_type_id" expanded rounded>
							<option v-for="crewAccountType in crewAccountTypeList"
											:value="crewAccountType.account_type_id"
											:key="crewAccountType.account_type_id">
								{{crewAccountType.station_name}}
							</option>
						</b-select>
					</b-field>
				</div>
			</div>

			<b-field label='Username' :type="errors.has('username') ? 'is-danger': ''"
				:message="errors.has('username') ? errors.first('username') : ''">
				<b-input placeholder='Enter Username' v-model="username" name="username" data-vv-as="'username'"
					v-validate="'required|regex:^[a-z0-9_-].*?$'" rounded></b-input>
			</b-field>

			<b-field label='Password' :type="errors.has('password') ? 'is-danger': ''"
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
			<button class="button is-success is-pulled-right" :disabled="disableBtn" @click="submit()">Submit</button>
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
			password:'',
			confirmPassword: '',
			account_type:'Admin',
			account_type_id: null
		}
	},
	async mounted() {
		let res = await this.$axios.get(`http://${config.serverURL}/user/getAccountTypeCrewList`)
		this.crewAccountTypeList = res.data
		console.log(res.data)
		if (this.$store.state.auth.user.account_type !== 'Master Admin') {
			this.account_type = 'Crew'
		}
		if (this.$route.params.id) {
			let stationId = this.$route.params.id
			this.account_type = 'Crew'
			for (let i in this.crewAccountTypeList) {
				if (stationId == this.crewAccountTypeList[i].station_id) {
					this.account_type_id = this.crewAccountTypeList[i].account_type_id
					break
				}
			}
		}
		this.$store.commit('setPageTitle', 'Add User')
	},
	methods:{
		async submit() {
			let res = await this.$axios.get(`http://${config.serverURL}/user`)
			let userList = res.data
			let userExist = false
			for (let i in userList) {
				if (userList[i].username.toLowerCase() === this.username.toLowerCase()) {
					userExist = true
					break
				}
			}
			if (userExist) {
				this.$dialog.alert({
					title: 'User Exists',
					message: `Username already exists`,
					type: 'is-success',
					hasIcon: true,
					icon: 'check-circle',
					iconPack: 'mdi'
				})
			}
			else {
				let webFormData = new DataModel.Account(this.account_type_id, this.username, this.password)
				// console.log(this.account_type_id + this.username + this.password)
				this.$axios.post(`http://${config.serverURL}/user/`, webFormData)
					.then(res => {
						if (res.status === 200) {
							this.$dialog.confirm({
								title: 'Add User',
								message: `A new user \'${this.username}\' has been successfully added.`,
								type: 'is-success',
								hasIcon: true,
								icon: 'check-circle',
								iconPack: 'mdi',
								onConfirm: () => this.$router.push('/Admin/Users')
							})
						}
					})
					.catch(err => {
						console.log(err)
					})
			}
		},
		getAccountTypeId() {
			if (this.account_type === 'Admin') {
				for (let i in this.crewAccountTypeList) {
					if (this.crewAccountTypeList[i].account_type === 'Admin') {
						this.account_type_id = this.crewAccountTypeList[i].account_type_id
					}
				}
			}
		}
	},
	computed: {
		isDisabled() {
			return (this.$store.state.auth.user.account_type !== 'Master Admin')
		},
		disableBtn() {
			return (!this.account_type_id || !this.username || !this.password || !this.confirmPassword)
		}
	}
}
</script>

<style scoped>
.right-spaced {
	margin-right: 1.5vw;
}
</style>
