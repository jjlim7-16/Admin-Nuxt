<template>
	<section id="content" class="box columns is-multiline">
		<div class="column is-6">
			<b-field label='Station Name' :type="errors.has('station') ? 'is-danger': ''"
				:message="errors.has('station') ? errors.first('station') : ''">
				<b-select expanded placeholder='Select Station' v-model="stationId"
					name="station" v-validate="'required'" data-vv-as="'Station'" rounded>
					<option v-for="station in stationList" :value="station.station_id" :key="station.station_name">
						{{station.station_name}}
					</option>
				</b-select>
			</b-field>

			<b-field label='Role Name' :type="errors.has('roleName') ? 'is-danger': ''"
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

			<b-field label='Capacity'>
				<b-select v-model='capacity' placeholder='Select Max. Capacity' required rounded>
					<option v-for="i in 30" :key="i" :value="i">{{ i }}</option>
				</b-select>
			</b-field>
		</div> <!-- end of column is-6 -->

		<!-- Upload Image field -->
		<div class="column is-4" style="margin-left: 2vw;">
			<b-field label="Role Image">
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

		<div class="column is-9">
			<br>
			<!-- Add Role button -->
			<button id="addRoleBtn" class="button is-success is-pulled-right"
			:disabled="isDisabled" @click="validateBeforeSubmit()">Submit</button>
			<router-link to="/Admin/Roles/"
			class="button is-light is-pulled-right right-spaced">Cancel</router-link>
		</div>
	</section>
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
			serverURL: config.serverURL
		}
	},
	async mounted() {
		let res = await this.$axios.get(`http://${config.serverURL}/roles/`)
		this.stationList = res.data[1]
		this.roleList = res.data[0]

		if (this.$route.params['id']) {
			this.stationId = this.$route.params['id']
		}

		this.$store.commit('setPageTitle', 'Add Role')
	},
	computed: {
    isDisabled() {
      return !this.roleName || !this.capacity || !this.files[0]
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
			let roleList = res.data[0]
			let roleExists = false
			for (let i in roleList) {
				if (roleList[i].role_name.toLowerCase() === this.roleName.trim().toLowerCase()) {
					roleExists = true
				}
			}
			if (roleExists) {
				this.$dialog.alert({
					title: "Error",
					message: `<b>${this.roleName}</b> already exists`,
					type: "is-danger",
					hasIcon: true
				})
			}
			else {
				let stationName = this.stationList.find(i => i.station_id === this.stationId).station_name
				let role = new DataModel.Role(this.roleName.trim(),this.capacity,
				this.files[0], this.stationId)

				let formData = new FormData()
				formData.append('Role-' + role.roleName, this.files[0])
				formData.append('webFormData', JSON.stringify(role))

				this.$axios.post(`http://${config.serverURL}/roles/`, formData)
				.then(res => {
					if (res.status === 200) {
						this.$dialog.alert({
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
