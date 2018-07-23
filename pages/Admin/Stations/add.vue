<template>
	<div id='form' class="box">
		<b-field label='Station Name *' width="410px" :type="errors.has('name') ? 'is-danger': ''" 
			:message="errors.has('name') ? errors.first('name') : ''">
			<b-input placeholder='Enter Station Name' v-model="name" name="name" data-vv-as="'Station Name'"
			v-validate="'required|alpha_spaces'"></b-input>
		</b-field>

		<b-field grouped>
			<b-field label="Select Start Time">
				<b-timepicker v-model="startTime"
					:min-time='minTime'
					:max-time='maxTime'
					:increment-minutes=10>
				</b-timepicker>
			</b-field>

			<b-field label="Select End Time">
				<b-timepicker v-model="endTime"
					:min-time='minTime'
					:max-time='maxTime'
					:increment-minutes=10>
				</b-timepicker>
			</b-field>
		</b-field>

		<b-field label="Description" width="410px">
			<b-input maxlength="500" type="textarea" v-model="description" required></b-input>
		</b-field>

		<b-field label='Image' style="margin-top: -10px">
			<b-field class='file'>
				<b-upload v-model='files' accept="image/*">
					<a class='button is-primary'>
						<b-icon icon='upload'></b-icon>
						<span>Upload Image</span>
					</a>
				</b-upload>
				<span class='file-name' v-if='files && files.length'>
				{{ files[0].name }}
				</span>
			</b-field>
		</b-field>

		<b-field label="Roles" >
			<b-field grouped group-multiline>
				<div class="control" v-if="roles.length>0" v-for="role in roles" :key="role.roleName">
					<b-tag v-if="(role.roleName)" 
						type="is-primary" size="is-medium" 
						attached closable
						@close="removeRole(role)">
						{{role.roleName}}
					</b-tag>
				</div>
				<button class="button is-primary"
					@click="isComponentModalActive = true">
					<b-icon icon="plus-circle"></b-icon>
					<span>Add Role</span>
				</button>
			</b-field>
		</b-field>

		<b-modal :active.sync="isComponentModalActive" @click="onClose()" has-modal-card>
			<modal-form></modal-form>
		</b-modal>

		<br/>
		<button class="button is-success" :disabled="isDisabled" @click="submit()">Add Station</button>
	</div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import DataModel from '../../../models/dataModel.js'
import config from '~/config.js'

let roleList = []
let stationName = ''
const ModalForm = {
	template: `<div>
<div class='modal-card' style='width: 560px'>
<header class='modal-card-head'>
<p class='modal-card-title'>Add Role</p>
</header>
<section class='modal-card-body'>
<b-field label='Role Name' :type="errors.has('roleName') ? 'is-danger': ''" 
:message="errors.has('roleName') ? errors.first('roleName') : ''">
<b-input style='width: 280px'
v-model='roleName'
placeholder='New Role'
name="roleName"
data-vv-as="'Role Name'"
v-validate="'required|alpha_spaces'">
</b-input>
</b-field>
<b-field grouped>
<b-field label='Capacity'>
<b-select v-model='capacity' placeholder='Select Max. Capacity' required>
<option>4</option>
<option>6</option>
<option>8</option>
</b-select>
</b-field>
<b-field label='Duration'>
<b-select placeholder='Select Activity Duration' v-model="duration">
<option value="20">20 mins</option>
<option value="30">30 mins</option>
<option value="40">40 mins</option>
</b-select>
</b-field>
</b-field grouped>
<b-field label='Image'>
<b-field class='file'>
<b-upload v-model='files' accept="image/*">
<a class='button is-primary'>
<b-icon icon='upload'></b-icon>
<span>Upload Image</span>
</a>
</b-upload>
<span class='file-name'
v-if='files && files.length'>
{{ files[0].name }}
</span>
</b-field>
</b-field>
</section>
<footer class='modal-card-foot'>
<button class='button' type='button' @click='$parent.close()'>Close</button>
<button class='button is-primary' :disabled='isDisabled' @click='addRole()'>Add New Role</button>
</footer>
</div>
</div> `,
	methods: {
		addRole() {
			let roleExist = false;
			let role = new DataModel.Role(this.roleName.trim(),this.capacity, this.duration, 2, this.files[0])
			
			if (roleList.length > 0) {
				let i = 0
				for (i = 0; i < roleList.length; i++) {
					if (this.roleName === roleList[i].roleName) {
						roleExist = true
						this.alertCustomError()
					}
					if (this.roleName === stationName) {
						this.alertRoleExists()
					}
				}
			}
			if (roleExist === false) {
				roleList.push(role)
				this.$parent.close()
			}
		},
		alertRoleExists() {
			this.$dialog.alert({
				title: "Role Exists",
				message: `Error! The Role \'${this.roleName}\' Already Exists`,
				type: "is-danger",
				hasIcon: true
			})
		}
	},
	data() {
		return {
			roleName: '',
			capacity: 4,
			duration: 20,
			files: []
		};
	},
	computed: {
		isDisabled() {
			return !this.roleName || !this.capacity || !this.files[0];
		}
	}
}

export default {
	components: {
		ModalForm
	},
	data() {
		const min = new Date()
		min.setHours(10)
		min.setMinutes(0)
		const max = new Date()
		max.setHours(18)
		max.setMinutes(0)
		return {
			isComponentModalActive: false,
			name: '',
			description: '',
			roles: [],
			minTime: min,
			maxTime: max,
			startTime: min,
			endTime: max,
			files: [],
			stationList: []
		}
	},
	beforeMount() {
		axios.get(`http://${config.serverURL}/stations`)
		.then(res => {
			this.stationList = res.data
		})
	},
	methods: {
		submit() {
			if (this.stationList.find(i => i.station_name.toLowerCase() === this.name.toLowerCase())) {
				this.$dialog.alert({
					title: 'Error: Add Station',
					message: `The Station: \'${this.name}\' already exists`,
					type: 'is-danger',
					hasIcon: true,
					icon: 'times-circle',
					iconPack: 'mdi'
				})
			}
			else {
				let station = new DataModel.Station(this.name.trim(),this.description.trim(), 
				moment(this.startTime, 'HH:mm').format('HH:mm'), moment(this.endTime, 'HH:mm').format('HH:mm'), 
				this.roles)

				let formData = new FormData()
				formData.append(station.name, this.files[0])
				for (var i = 0; i < station.roles.length; i++) {
					let file = station.roles[i].file
					formData.append("Role-" + station.roles[i].roleName, file)
				}
				formData.append('webFormData', JSON.stringify(station))
				// console.log(formData.get('station'))

				axios.post(`http://${config.serverURL}/stations/`, formData)
					.then(res => {
						roleList = []
						this.roles = roleList
						if (res.status === 200) {
							this.$dialog.alert({
								title: 'Add Station',
								message: `A new station \'${this.name}\' has been successfully added.`,
								type: 'is-success',
								hasIcon: true,
								icon: 'check-circle',
								iconPack: 'mdi'
							})
							// this.name = ''
							// this.description = ''
							// this.startTime = this.minTime
							// this.endTime = this.maxTime
							// this.files = []
							this.$router.push('/Admin/Stations')
						}
						else {
							console.log(res)
						}
					})
					.catch((err) => {
						console.log(err)
					})
				}
		},
		removeRole(role) {
			this.roles.splice(this.roles.findIndex(i => i.roleName === role.roleName), 1)
			roleList = this.roles;
		}
	},
	computed: {
		isDisabled() {
			return !this.name || !(this.roles.length > 0) || !this.description || !this.files[0]
		},
		getRoles() {
			roles = roleList
		}
	},
	beforeUpdate() {
		this.roles = roleList
		stationName = this.name
		// console.log(moment(this.startTime, 'HH:mm').format('HH:mm').toString())
		// console.log(this.roles)
	}
}
</script>

<style>
#form {
	margin: 25px 60px 25px 70px;
}
</style>