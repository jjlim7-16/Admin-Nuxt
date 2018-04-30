<template>
	<section class='column is-three-fifths' id='form'>
		<b-field label='Station Name *' style="width: 500px">
			<b-input placeholder='Enter Station Name' v-model="name" required></b-input>
		</b-field>

		<b-field grouped>
			<b-field label='Number of Sessions'>
				<b-select placeholder='Select Max. Sessions' v-model="sessions">
					<option>4</option>
					<option>6</option>
					<option>8</option>
				</b-select>
			</b-field>

			<b-field label='Duration'>
				<b-select placeholder='Select Activity Duration' v-model="duration">
					<option>20 mins</option>
					<option>30 mins</option>
					<option>40 mins</option>
				</b-select>
			</b-field>
		</b-field>

		<b-field grouped>
			<b-field label="Select Start Time">
				<b-timepicker v-model="startTime"
					placeholder="Click to select...">
					<button class="button is-primary"
						@click="startTime = new Date()">
						<b-icon icon="clock"></b-icon>
						<span>Now</span>
					</button>
				</b-timepicker>
			</b-field>

			<b-field label="Select End Time">
				<b-timepicker v-model="endTime"
					placeholder="Click to select...">
					<button class="button is-primary"
						@click="endTime = new Date()">
						<b-icon icon="clock"></b-icon>
						<span>Now</span>
					</button>
				</b-timepicker>
			</b-field>
		</b-field>

		<button class="button is-primary"
			@click="isComponentModalActive = true">
			<b-icon icon="plus-circle"></b-icon>&nbsp; Add Role
		</button>

		<b-modal :active.sync="isComponentModalActive" @click="onClose()" has-modal-card>
			<modal-form></modal-form>
		</b-modal>

		<b-field v-for="role in roles" :key="role.roleName" grouped>
			<div class="control">
				<br/>
				<b-tag v-if="(role.roleName)" 
					type="is-primary" size="is-medium" 
					attached closable
					@close="removeRole(role)">
					{{role.roleName}}
				</b-tag>
			</div>
		</b-field>
		<br/><br/>
		<button class="button is-success" :disabled="isDisabled" @click="submit()">Add Station</button>
	</section>
	
</template>

<script>
import axios from 'axios'
import Vuex from 'vuex'

function WebFormDataRole(roleName, capacity, file) {
	this.roleName = roleName
	this.capacity = capacity
	this.file = file
}
let webFormDataRole
let roleList = []
const ModalForm = {
  template: `<div>
<div class='modal-card' style='width: 560px'>
<header class='modal-card-head'>
<p class='modal-card-title'>Add Role</p>
</header>
<section class='modal-card-body'>
<b-field label='Role Name'>
<b-input style='width: 280px'
v-model='roleName'
placeholder='New Role'
required>
</b-input>
</b-field>
<b-field label='Capacity'>
<b-select v-model='capacity' placeholder='Select Max. Capacity' required>
<option>4</option>
<option>6</option>
<option>8</option>
</b-select>
</b-field>
<b-field label='Image' class='files'>
<b-upload v-model='files'>
<a class='button is-primary'>
<b-icon icon='upload'></b-icon>
<span>Upload Image</span>
</a>
</b-upload>
<span class='files-name'
v-if='files && files.length'>
{{ files[0].name }}
</span>
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
		//this.roleList.push(this.role)
		//console.log(this.roleList)
		let roleExist = false
		//console.log(this.files[0])
		webFormDataRole = new WebFormDataRole(this.roleName, this.capacity, this.files[0])
		//console.log(webFormDataRole)
		console.log(roleList.length)
		if (roleList.length > 0) {
			let i = 0
			for (i=0; i<roleList.length; i++) {
				if (this.roleName === roleList[i].roleName) {
					roleExist = true
					this.alertCustomError()
				}
				console.log(roleList[i].roleName)
			}
		}
		if (roleExist === false) {
			roleList.push(webFormDataRole)
			this.$parent.close()
		}
	},
	alertCustomError() {
		this.$dialog.alert({
			title: 'Error',
			message: `Error! The Role \'${this.roleName}\' Already Exists`,
			type: 'is-danger',
			hasIcon: true,
			icon: 'times-circle',
			iconPack: 'fa'
		})
	}
},
data() {
	return {
		roleName: '',
		capacity: 4,
		files: []
	}
},
computed: {
	isDisabled() {
		console.log(this.files[0])
		return !this.roleName || !this.capacity || !this.files[0]
	}
}
}

function WebFormData(name, description, noOfRoles, sessions, 
										noRSlots, startTime, endTime, roles) {
	this.name = name,
	this.description = description,
	this.noOfRoles = noOfRoles,
	this.sessions = sessions,
	this.noRSlots = noRSlots,
	this.startTime = startTime,
	this.endTime = endTime,
	this.roles = roles
}

export default {
	components: {
		ModalForm
	},
	data () {
		return {
			isComponentModalActive: false,
			name: '',
			description: '',
			duration: '20 mins',
			sessions: 4,
			startTime: new Date(),
			endTime: new Date(),
			roles: []
		}
	},
	methods: {
		submit() {
			//let reader = new FileReader()
			//reader.readAsDataURL(webFormDataRole.file);
			/*
			console.log(this.name)
			console.log(this.sessions)
			console.log(webFormDataRole.file)
			console.log(roleList) */
			let webFormData = new WebFormData(this.name, this.description, 2,this.sessions, 
										2, this.startTime, this.endTime, this.roles)
			
			let formData = new FormData()
			for (var i=0; i<webFormData.roles.length; i++) {
				let file = webFormData.roles[i].file
				console.log(file)
				formData.append('file-'+webFormData.roles[i].roleName, file)
			}
			
			axios.post('http://localhost:8000/stations/addFile',
				formData, 
				{
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}
			).then(() => {
				console.log('SUCCESS')
			})
			.catch(() => {
				console.log('FAILURE')
			})
			
		},
		removeRole(role) {
			this.roles.pop(role)
			roleList = this.roles
		}
	},
	computed: {
		isDisabled() {
			return !this.name || !this.roles
		},
		getRoles() {
			roles = roleList
			console.log(roles)
			//return
		}
	},
	updated() {
		//console.log(roleList)
		this.roles = roleList
	}
}
</script>

<style>
#form {
  float: right
}
</style>