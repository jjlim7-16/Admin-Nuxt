<template>
<section id='content' class="box columns is-multiline">
	<div class="column is-6">
		<b-field label='Station Name' :type="errors.has('name') ? 'is-danger': ''" :message="errors.has('name') ? errors.first('name') : ''">
			<b-input placeholder='Enter Station Name' v-model="name" name="name"
			data-vv-as="'Station Name'" v-validate="'required|alpha_spaces'" rounded></b-input>
		</b-field>

		<b-field label='Activity Duration'>
			<b-select expanded placeholder='Select Activity Duration' @input="getTimeList" v-model="duration" rounded>
				<option value="10">10 mins</option>
				<option value="15">15 mins</option>
				<option value="20">20 mins</option>
				<option value="25">25 mins</option>
				<option value="30">30 mins</option>
			</b-select>
		</b-field>

		<div class="columns">
			<div class="column is-half">
				<b-field label='Select Start Time'>
					<b-select expanded placeholder="Select Start Time" v-model="startTime" rounded>
						<option disabled>Please select activity duration first</option>
						<option v-for="start in filterStartTime" :value="start" :key="start">
							{{ start }}
						</option>
					</b-select>
				</b-field>
			</div>

			<div class="column is-half">
				<b-field label='Select End Time'>
					<b-select expanded placeholder="Select End Time" v-model="endTime" rounded>
						<option disabled>Please select activity duration first</option>
						<option v-for="end in filterEndTime" :value="end" :key="end">
							{{ end }}
						</option>
					</b-select>
				</b-field>
			</div>
		</div>

		<b-field label='Set Limit'>
			<b-select expanded v-model='limit' placeholder='Select Limit' required rounded>
				<option v-for="i in 11" :key="i" :value="i-1">
					<span v-if="i===1">No Limit</span>
					<span v-else>{{ i-1 }}</span>
				</option>
			</b-select>
		</b-field>

		<b-field label="Description" :type="errors.has('description') ? 'is-danger': ''"
			:message="errors.has('description') ? errors.first('description') : ''">
			<b-input maxlength="500" rows="5" type="textarea" name="description" v-validate="'required'"
			data-vv-as="'Description'" v-model="description"></b-input>
		</b-field>
	</div>

	<div class="column is-4">
		<b-field label="Station Image">
			<b-upload v-model="files" accept="image/*" multiple drag-drop>
				<section class="section" v-if="!files || files.length <= 0">
					<div class="content has-text-centered" id="preview">
						<p>
							<b-icon icon="upload" size="is-large"></b-icon>
						</p>
						<p>Click to upload an image</p>
					</div>
				</section>
				<section class="image-section" v-else-if="files && files.length > 0">
					<figure id="preview" class="content has-text-centered image is-4by3">
						<img :src="readImageFile">
					</figure>
				</section>
			</b-upload>
		</b-field>
	</div>

	<div class="column is-10">
		<b-field label="Roles">
			<b-field grouped group-multiline>
				<div class="control" v-if="roles.length>0" v-for="role in roles" :key="role.roleName">
					<b-tag v-if="(role.roleName)" type="is-primary" size="is-medium" attached closable @close="removeRole(role)">
						{{role.roleName}}
					</b-tag>
				</div>
				<button class="button is-primary" @click="isComponentModalActive = true">
					<b-icon icon="plus-circle"></b-icon>
					<span>Add Role</span>
				</button>
			</b-field>
		</b-field>

		<b-modal :active.sync="isComponentModalActive" @click="onClose()" has-modal-card>
			<modal-form></modal-form>
		</b-modal>

		<br/>

		<!-- Add Station button -->
		<button class="button is-success is-pulled-right" :disabled="isDisabled"
		@click.prevent="validateBeforeSubmit">Submit</button>

		<router-link to="/Admin/Stations/" class="button is-light right-spaced is-pulled-right">Cancel</router-link>
	</div>
</section>
</template>

<script>
import moment from 'moment'
import DataModel from '~/models/dataModel.js'
import config from '~/config.js'

let roleList = []
const ModalForm = {
	template: `<div>
<div class='modal-card'>
<header class='modal-card-head'>
<p class='modal-card-title'>Add Role</p>
</header>
<section class='modal-card-body columns is-marginless'>
	<div class='column'>
		<b-field label='Role Name' :type="errors.has('roleName') ? 'is-danger': ''"
		:message="errors.has('roleName') ? errors.first('roleName') : ''">
			<b-input
				v-model='roleName'
				placeholder='Enter Role Name'
				name="roleName"
				data-vv-as="'Role Name'"
				v-validate="'required|alpha_spaces'"
				rounded>
			</b-input>
		</b-field>
		<b-field class='columns' grouped>
			<div class='column is-half'>
				<b-field label='Capacity'>
					<b-select expanded v-model='capacity' placeholder='Select Max. Capacity' required rounded>
						<option v-for="i in 12" :key="i">{{ i }}</option>
					</b-select>
				</b-field>
			</div>
		</b-field>
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
	</div>
</section>
<footer class='modal-card-foot'>
<button class='button' type='button' @click='$parent.close()'>Close</button>
<button class='button is-primary' :disabled='isDisabled' @click.prevent='validateBeforeSubmit()'>Add New Role</button>
</footer>
</div>
</div> `,
	methods: {
		async addRole() {
			let roleExist = false
			if (roleList.length > 0) {
				for (var i in roleList) {
					if (roleList[i].roleName.toLowerCase() === this.roleName.trim().toLowerCase()) {
						roleExist = true
						break
					}
				}
			}
			let res = await this.$axios.get(`http://${config.serverURL}/roles`)
			let fullRoleList = res.data[0]
			for (var i in fullRoleList) {
				if (fullRoleList[i].role_name.toLowerCase() === this.roleName.trim().toLowerCase()) {
					roleExist = true
					break
				}
			}
			if (roleExist) {
				this.alertRoleExists()
			}
			else {
				let role = new DataModel.Role(this.roleName.trim(),this.capacity, this.files[0])
				roleList.push(role)
				this.$parent.close()
			}
		},
		alertRoleExists() {
			this.$dialog.alert({
				title: "Error",
				message: `<b>${this.roleName}</b> already exists`,
				type: "is-danger",
				hasIcon: true
			})
		},
		validateBeforeSubmit() {
			this.$validator.validateAll().then(res => {
				if (res) {
					this.addRole()
				}
			})
		}
	},
	data() {
		return {
			roleName: '',
			capacity: 4,
			files: []
		};
	},
	computed: {
		isDisabled() {
			return !this.roleName || !this.capacity || !this.files[0]
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
			duration: 15,
			minTime: min,
			maxTime: max,
			startTime: null,
			endTime: null,
			limit: 0,
			timeList: [],
			files: [],
		}
	},
	mounted() {
		this.$store.commit('setPageTitle', 'Add Station')
		this.getTimeList()
	},
	methods: {
		async submit() {
			let res = await this.$axios.get(`http://${config.serverURL}/stations/`)
			let stationList = res.data
			let stationExists = false
			for (let i in stationList) {
				if (stationList[i].station_name.toLowerCase() === this.name.trim().toLowerCase() &&
				stationList[i].station_id != this.$route.params.id) {
					stationExists = true
					break
				}
			}
			if (stationExists) {
				this.$dialog.alert({
					title: "Station Exists",
					message: `Error! <b>${this.name}</b> already exists`,
					type: "is-danger",
					hasIcon: true
				})
			}
			else {
				let station = new DataModel.Station(this.name.trim(), this.description.trim(),
					moment(this.startTime, 'HH:mm').format('HH:mm'), moment(this.endTime, 'HH:mm').format('HH:mm'),
					this.duration, this.limit, this.roles)

				let formData = new FormData()
				formData.append('webFormData', JSON.stringify(station))
				formData.append(station.name, this.files[0])
				for (var i = 0; i < station.roles.length; i++) {
					let file = station.roles[i].file
					formData.append("Role-" + station.roles[i].roleName, file)
				}

				this.$axios.post(`http://${config.serverURL}/stations/`, formData)
					.then(res => {
						roleList = []
						this.roles = roleList
						if (res.status === 200) {
							this.$dialog.alert({
								title: 'Add Station',
								message: `<b>${this.name}</b> has been successfully added.
													Please make sure to add a crew account associated to this station.`,
								type: 'is-success',
								hasIcon: true,
								icon: 'check-circle',
								iconPack: 'mdi',
								onConfirm: () => this.$router.push(`/Admin/Users/Add/${res.data}`)
							})
						}
					})
					.catch((err) => {
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
		},
		removeRole(role) {
			this.roles.splice(this.roles.findIndex(i => i.roleName === role.roleName), 1)
			roleList = this.roles;
		},
		getTimeList() {
			this.timeList = []
			let currTime = moment(this.minTime, 'HH:mm')
			while (currTime <= moment(this.maxTime, 'HH:mm')) {
				this.timeList.push(currTime.format('HH:mm'))
				currTime.add(this.duration, 'minutes')
			}
		}
	},
	computed: {
		isDisabled() {
			return !this.name || !(this.roles.length > 0) || !this.description || !this.files[0]
		},
		getRoles() {
			roles = roleList
		},
		readImageFile() {
			if (this.files) {
				return URL.createObjectURL(this.files[0])
			}
		},
		filterStartTime() {
			if (this.endTime) {
				return this.timeList.filter(i => moment(i, 'HH:mm').isBefore(moment(this.endTime, 'HH:mm')))
			}
			return this.timeList.slice(0, -1)
		},
		filterEndTime() {
			if (this.startTime) {
				return this.timeList.filter(i => moment(i, 'HH:mm').isAfter(moment(this.startTime, 'HH:mm')))
			}
			return this.timeList.slice(0)
		}
	},
	beforeUpdate() {
		this.roles = roleList
	}
}
</script>

<style scoped>
.right-spaced {
	margin-right: 1.5vw;
}

#preview {
	width: 20vw;
	height: 80%;
}

.section {
	height: 30vh;
}

.image-section {
	padding: 24px;
}
</style>
