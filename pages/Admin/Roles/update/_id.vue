<template>
	<div id="form">
		<b-field label='Station*' :type="errors.has('station') ? 'is-danger': ''" 
			:message="errors.has('station') ? errors.first('station') : ''">
			<b-select placeholder='Select Station' v-model="stationId" name="stationId" v-validate="'required'"
			data-vv-as="'Station'" expanded>
				<option v-for="station in stationList" :value="station.station_id" :key="station.station_name">
					{{station.station_name}}
				</option>
			</b-select>
		</b-field>

		<b-field label='Role Name*' width="410px" :type="errors.has('roleName') ? 'is-danger': ''" 
			:message="errors.has('roleName') ? errors.first('roleName') : ''">
			<b-input 
				placeholder='Enter Role Title' 
				name="roleName" 
				v-model="roleName" 
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
				<b-select placeholder='Select Activity Duration' v-model="duration" required>
					<option value="20">20 mins</option>
					<option value="30">30 mins</option>
					<option value="40">40 mins</option>
				</b-select>
			</b-field>
		</b-field>

		<b-field label='Image*'>
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
		
		<br/>
		<button class="button is-success" :disabled="isDisabled" @click="update()">Update Role</button>
		&nbsp;&nbsp;
		<button class="button is-danger" @click="remove()">Delete Role</button>
	</div>
</template>

<script>
import axios from 'axios'
import DataModel from '../../../../models/dataModel.js'

export default {
	data() {
		return {
			roleName: '',
			capacity: 4,
			duration: 20,
			files: [],
			stationList: [],
			stationId: null
		}
	},
	beforeCreate() {
		axios.get('http://localhost:8000/roles/' + this.$route.params['id'])
		.then((res) => {
			this.stationList = res.data[1]
			
			let data = res.data[0][0]
			this.roleName = data.role_name
			this.duration = data.durationInMins
			this.capacity = data.capacity
			this.stationId = data.station_id
		})
	},
	computed: {
		isDisabled() {
			return !this.roleName || !this.capacity || !this.files[0];
		}
	},
	methods: {
		update() {
			let stationName = this.stationList.find(i => i.station_id === this.stationId).station_name
			let role = new DataModel.Role(this.roleName.trim(),this.capacity, this.duration, 2, 
			this.files[0], this.stationId)
			
			let formData = new FormData()
			formData.append(stationName + '-' + role.roleName, this.files[0])
			formData.append('webFormData', JSON.stringify(role))
			
			axios.put("http://localhost:8000/roles/" + this.$route.params['id'], formData)
			.then(res => {
				if (res.status === 200) {
					this.$dialog.alert({
						title: 'Update Role',
						message: `The Role \'${this.roleName}\' has been successfully updated`,
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
		},
		remove() {
			axios.delete("http://localhost:8000/roles/" + this.$route.params['id'])
			.then(res => {
				if (res.status === 200) {
					this.$dialog.alert({
						title: 'Delete Role',
						message: `The Role \'${this.roleName}\' has been successfully deleted`,
						type: 'is-success',
						hasIcon: true,
						icon: 'check-circle',
						iconPack: 'mdi'
					})
					this.$route.push('/Admin/Roles')
				}
			})
		}
	}
}
</script>

<style>
#form {
	margin: 25px 60px 25px 70px;
}
</style>
