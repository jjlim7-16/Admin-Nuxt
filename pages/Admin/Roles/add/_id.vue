<template>
	<div id="content" class="box">
		<b-field label='Station Name *' :type="errors.has('station') ? 'is-danger': ''"
			:message="errors.has('station') ? errors.first('station') : ''">
			<b-select expanded placeholder='Select Station' v-model="stationId"
				name="station" v-validate="'required'" data-vv-as="'Station'">
				<option v-for="station in stationList" :value="station.station_id" :key="station.station_name">
					{{station.station_name}}
				</option>
			</b-select>
		</b-field>

		<b-field label='Role Name *' :type="errors.has('roleName') ? 'is-danger': ''"
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
				<b-select placeholder='Select Activity Duration' :value="getDuration">
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
		<button class="button is-success" :disabled="isDisabled" @click="submit()">Add Role</button>
	</div>
</template>

<script>
import axios from 'axios'
import DataModel from '../../../../models/dataModel.js'
import config from '~/config.js'

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
		axios.get(`http://${config.serverURL}/roles/`)
		.then((res) => {
			this.stationList = res.data[1]
			this.roleList = res.data[0]
		})
		this.$store.commit('setPageTitle', 'Add Role')
	},
	mounted() {
		if (this.$route.params['id']) {
			this.stationId = this.$route.params['id']
		}
	},
	computed: {
    isDisabled() {
      return !this.roleName || !this.capacity || !this.files[0]
		},
		getDuration() {
			if (this.stationId && this.roleList) {
				return this.roleList.find(i => i.station_id === this.stationId).durationInMins
			}
		}
	},
	methods: {
		submit() {
			// let stationName = this.stationList.find(i => i.station_id === this.stationId).station_name
			if (this.roleList.find(i => i.role_name === this.roleName.trim())) {
				this.$dialog.alert({
					title: "Role Exists",
					message: `Error! The Role \'${this.roleName}\' Already Exists`,
					type: "is-danger",
					hasIcon: true
				})
			}
			else {
				let role = new DataModel.Role(this.roleName.trim(),this.capacity, this.duration, 2,
				this.files[0], this.stationId)

				let formData = new FormData()
				formData.append('Role-' + role.roleName, this.files[0])
				formData.append('webFormData', JSON.stringify(role))

				axios.post(`http://${config.serverURL}/roles/`, formData)
				.then(res => {
					if (res.status === 200) {
						this.$dialog.alert({
							title: 'Add Role',
							message: `A new role has been successfully added to \'${stationName}\'.`,
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
		}
	}
}
</script>
