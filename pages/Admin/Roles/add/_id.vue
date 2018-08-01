<template>
	<section id="content" class="box columns">

		<div class="column is-6">
			<b-field label='Station Name *' :type="errors.has('station') ? 'is-danger': ''"
				:message="errors.has('station') ? errors.first('station') : ''">
				<b-select expanded placeholder='Select Station' v-model="stationId"
					name="station" v-validate="'required'" data-vv-as="'Station'" rounded>
					<option v-for="station in stationList" :value="station.station_id" :key="station.station_name">
						{{station.station_name}}
					</option>
				</b-select>
			</b-field>

			<b-field label='Role Name *' :type="errors.has('roleName') ? 'is-danger': ''"
				:message="errors.has('roleName') ? errors.first('roleName') : ''" >
				<b-input
					placeholder='Enter Role Name'
					name="roleName"
					v-model="roleName"
					data-vv-as="'Role Name'"
					v-validate="'required|alpha_spaces'"
					rounded>
				</b-input>
			</b-field>

			<b-field label='Duration'>
				<b-select expanded placeholder='Select Activity Duration' :value="getDuration" disabled rounded>
					<option value="15">15 mins</option>
					<option value="20">20 mins</option>
					<option value="25">25 mins</option>
					<option value="30">30 mins</option>
				</b-select>
			</b-field>

			<b-field label='Capacity'>
				<b-select expanded size="5" v-model='capacity' placeholder='Select Max. Capacity' required rounded>
					<option v-for="i in 30" :key="i" :value="i">{{ i }}</option>
				</b-select>
			</b-field>

			<br>
			<!-- Add Role button -->
			<button id="addRoleBtn" class="button is-success" :disabled="isDisabled" @click="submit()">Add Role</button>

		</div> <!-- end of column is-6 -->

		<!-- Upload Image field -->
		<div class="column is-4" style="margin-left: 2vw;">
			<b-field label="Station Image">
				<b-upload v-model="files" drag-drop>
					<section class="section" v-if="!files || files.length <= 0">
						<div class="content has-text-centered" id="preview">
							<p><b-icon icon="upload" size="is-large"></b-icon></p>
							<p>Click to upload an image</p>
						</div>
					</section>
					<section class="image-section" v-else-if="files && files.length > 0">
						<figure id="preview" class="content has-text-centered image is-4by5">
							<img :src="readImageFile">
						</figure>
					</section>
				</b-upload>
			</b-field>
		</div>


	</section>
</template>

<script>
import axios from 'axios'
import DataModel from '~/models/dataModel.js'
import config from '~/config.js'

export default {
	data() {
		return {
			roleName: '',
			capacity: 4,
			duration: 20,
			files: [],
			stationList: [],
			stationId: null,
			serverURL: config.serverURL
		}
	},
	async beforeMount() {
		let res = await this.$axios.get(`http://${config.serverURL}/roles/`)
		this.stationList = res.data[1]
		this.roleList = res.data[0]

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
		},
		readImageFile() {
			if (this.files) {
				return URL.createObjectURL(this.files[0])
			}
		}
	},
	methods: {
		async submit() {
			let res = await this.$axios.get(`http://${config.serverURL}/roles/`)
			this.roleList = res.data[0]
			if (this.roleList.find(i => i.role_name === this.roleName.trim())) {
				this.$dialog.alert({
					title: "Role Exists",
					message: `Error! The Role \'${this.roleName}\' Already Exists`,
					type: "is-danger",
					hasIcon: true
				})
			}
			else {
				let stationName = this.stationList.find(i => i.station_id === this.stationId).station_name
				let role = new DataModel.Role(this.roleName.trim(),this.capacity, this.duration, 2,
				this.files[0], this.stationId)

				let formData = new FormData()
				formData.append('Role-' + role.roleName, this.files[0])
				formData.append('webFormData', JSON.stringify(role))

				this.$axios.post(`http://${config.serverURL}/roles/`, formData)
				.then(res => {
					if (res.status === 200) {
						this.$dialog.confirm({
							title: 'Add Role',
							message: `A new role has been successfully added to \'${stationName}\'.`,
							type: 'is-success',
							hasIcon: true,
							icon: 'check-circle',
							iconPack: 'mdi',
							onConfirm: () => this.$router.push('/Admin/Roles')
						})
					}
				})
			}
		}
	}
}
</script>

<style scoped>
#preview {
	width: 20vw;
	height: 80%;
}

.section {
	height: 33vh;
}

.image-section {
	padding: 12px;
}
</style>
