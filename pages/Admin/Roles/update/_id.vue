<template>
	<div id="content" class="box columns is-multiline">
		<div class="column is-6">
			<b-field label='Station Name' :type="errors.has('station') ? 'is-danger': ''"
				:message="errors.has('station') ? errors.first('station') : ''">
				<b-select placeholder='Select Station' v-model="stationId" name="stationId" v-validate="'required'"
				data-vv-as="'Station'" expanded rounded>
					<option v-for="station in stationList" :value="station.station_id" :key="station.station_name">
						{{station.station_name}}
					</option>
				</b-select>
			</b-field>

			<b-field label='Role Name' :type="errors.has('roleName') ? 'is-danger': ''"
				:message="errors.has('roleName') ? errors.first('roleName') : ''">
				<b-input
					placeholder='Enter Role Name'
					name="roleName"
					v-model="roleName"
					data-vv-as="'Role Name'"
					v-validate="'required|alpha_spaces'"
					rounded>
				</b-input>
			</b-field>

			<b-field label='Capacity'>
				<b-select v-model='capacity' placeholder='Select Max. Capacity' rounded required>
					<option v-for="i in 30" :key="i">{{ i }}</option>
				</b-select>
			</b-field>
		</div>

		<div class="column is-4" style="margin-left: 2vw;">
			<b-field label="Role Image">
				<b-upload v-model="files" @input="imageChanged=true" drag-drop>
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

		<div class="column is-9">
			<br>
			<!-- Add Role button -->
			<button class="button is-success is-pulled-right"
			:disabled="isDisabled" @click="validateBeforeSubmit()">Save Changes</button>
			<router-link to="/Admin/Roles/"
			class="button is-light is-pulled-right right-spaced">Cancel</router-link>
		</div>
	</div>
</template>

<script>
import DataModel from '~/models/dataModel.js'
import config from '~/config.js'

export default {
	data() {
		return {
			roleName: '',
			capacity: 4,
			files: [],
			stationList: [],
			stationId: null,
			currRole: null,
			imageChanged: false
		}
	},
	async mounted() {
		try {
			let res = await this.$axios.get(`http://${config.serverURL}/roles/${this.$route.params['id']}`)
			this.stationList = res.data[1]
			this.currRole = res.data[0][0]
			this.roleName = this.currRole.role_name
			this.capacity = this.currRole.capacity
			this.stationId = this.currRole.station_id


			res = await this.$axios.get(`http://${config.serverURL}/image/getRoleImage/${this.$route.params['id']}`, {
				responseType: 'blob'
			})
			let file = new File([res.data], 'image.png', { type: 'image/png' })
			this.files.push(file)

			this.$store.commit('setPageTitle', 'Edit Role')
		} catch(err) {
			console.log(err)
		}
	},
	computed: {
		isDisabled() {
			if (this.currRole) {
				return (this.currRole.role_name === this.roleName && this.currRole.capacity === this.capacity
				&& this.imageChanged === false && this.stationId === this.currRole.station_id) || !this.roleName || !this.capacity || !this.files[0]
			}
		},
		readImageFile() {
			return URL.createObjectURL(this.files[0])
		}
	},
	methods: {
		async submit() {
			let res = await this.$axios.get(`http://${config.serverURL}/roles/`)
			let roleList = res.data[0]
			let roleExists = false
			for (let i in roleList) {
				if (roleList[i].role_name.toLowerCase() === this.roleName.trim().toLowerCase() &&
				roleList[i].role_id != this.$route.params.id) {
					roleExists = true
				}
			}
			if (roleExists) {
				this.$dialog.alert({
					title: "Role Exists",
					message: `Error! The Role: \'${this.roleName}\' Already Exists`,
					type: "is-danger",
					hasIcon: true
				})
			}
			else {
				let stationName = this.stationList.find(i => i.station_id === this.stationId).station_name
				let role = new DataModel.Role(this.roleName.trim(),this.capacity, this.files[0], this.stationId)

				let formData = new FormData()
				if (this.imageChanged) {
					formData.append('Role-' + role.roleName, this.files[0])
				}
				formData.append('webFormData', JSON.stringify(role))

				this.$axios.put(`http://${config.serverURL}/roles/` + this.$route.params['id'], formData)
				.then(res => {
					if (res.status === 200) {
						this.$dialog.alert({
							title: 'Update Role',
							message: `The Role \'${this.roleName}\' has been successfully updated`,
							type: 'is-success',
							hasIcon: true,
							icon: 'check-circle',
							iconPack: 'mdi',
							onConfirm: () => this.$router.push('/Admin/Roles')
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
	}
}
</script>

<style scoped>
.right-spaced {
  margin-right: 1.5vw;
}

#preview {
	width: 12vw;
	height: 60%;
}

.section {
	height: 30vh;
}

.image-section {
	padding: 12px;
}
</style>
