<template>
	<section id="content" class="box">
		<div class="is-pulled-left">
			<b-field label='Station Name*'>
				<b-input placeholder='Enter Station Name' v-model="name" required></b-input>
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

			<b-field label="Description">
				<b-input maxlength="500" type="textarea" v-model="description" required></b-input>
			</b-field>

			<b-field label='Image' style="margin-top: -2vh">
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
			<button class="button is-success" :disabled="isDisabled" @click="submit()">Update Station</button>
			&nbsp;&nbsp;
			<button class="button is-danger" @click='remove()'>Remove Station</button>
		</div>

		<div class="is-pulled-right">
			<b-field label="Image">
				<b-upload v-model="files" @input="imageChanged = true" drag-drop>
					<section class="section" v-if="!files || files.length <= 0">
						<div class="content has-text-centered" id="preview">
							<p><b-icon icon="upload" size="is-large"></b-icon></p>
							<p>Drop your image here or click to upload</p>
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
	</section>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import DataModel from '../../../../models/dataModel.js'
import config from '~/config'

export default {
	data() {
		const min = new Date()
		min.setHours(10)
		min.setMinutes(0)
		const max = new Date()
		max.setHours(18)
		max.setMinutes(0)
		return {
			name: '',
			description: '',
			minTime: min,
			maxTime: max,
			startTime: min,
			endTime: max,
			files: [],
			imageurl: '',
			imageChanged: false,
			origData: null
		}
	},
	async beforeMount() {
		this.$store.commit('setPageTitle', 'Update Station')
		
		try {
			let res = await this.$axios.get(`http://${config.serverURL}/stations/` + this.$route.params['id'])
			this.origData = res.data[0]
			this.name = this.origData.station_name
			this.description = this.origData.description
			let start = new Date()
			start.setHours(this.origData.station_start.slice(0,2))
			start.setMinutes(this.origData.station_start.slice(3,5))
			this.startTime = start
			
			let end = new Date()
			end.setHours(this.origData.station_end.slice(0,2))
			end.setMinutes(this.origData.station_end.slice(3,5))
			this.endTime = end
			
			res = await this.$axios.get(`http://${config.serverURL}/stations/getImage/${this.$route.params.id}`)
			let file = new File([res.data], 'image', { type: 'image/*' })
			this.files.push(file)
			this.imageurl = `http://${config.serverURL}/stations/getImage/${this.$route.params.id}`
			
			res = await this.$axios.get(`http://${config.serverURL}/stations/`)

		} catch (error) {
			console.log(error)
		}
	},
	methods: {
		async submit() {
			let res = await this.$axios.get(`http://${config.serverURL}/stations/`)
			if (res.data.find(i => i.station_name.toLowerCase() === this.name.trim().toLowerCase() 
			&& i.station_id != this.$route.params.id)) {
				this.$dialog.alert({
					title: "Station Exists",
					message: `Error! The Station \'${this.name}\' Already Exists`,
					type: "is-danger",
					hasIcon: true
				})
			}
			else {
				let webFormData = new DataModel.Station(this.name.trim(), this.description.trim(), 
				moment(this.startTime, 'HH:mm').format('HH:mm'), 
				moment(this.endTime, 'HH:mm').format('HH:mm'))
				
				let formData = new FormData()
				if (this.imageChanged === true) {
					formData.append(webFormData.name, this.files[0])
				}
				formData.append('webFormData', JSON.stringify(webFormData))
				
				this.$axios.put(`http://${config.serverURL}/stations/` + this.$route.params['id'],
					formData
				).then(res => {
					if (res.status === 200) {
						this.$dialog.confirm({
							title: 'Update Station',
							message: 'The Station: ' + this.name + ' has been updated successfully',
							type: 'is-success',
							hasIcon: true,
							icon: 'check-circle',
							iconPack: 'mdi',
							onConfirm: () => this.$router.push('/Admin/Stations')
						})
					}
				})
				.catch(() => {
					console.log('FAIL')
				})
			}
		},
		remove() {
			this.$dialog.confirm({
				title: 'Remove Station',
				message: 'Are you sure you want to remove this station?',
				confirmText: 'Remove Station',
				type: 'is-danger',
				hasIcon: true,
				onConfirm: () => this.confirmDelete()
			})
		},
		confirmDelete() {
			this.$axios.delete(`http://${config.serverURL}/stations/` + this.$route.params['id'])
			.then(res => {
				if (res.status === 200) {
					this.$dialog.confirm({
						title: 'Remove Station',
						message: 'The Station: ' + this.name + ' has been removed successfully',
						type: 'is-success',
						hasIcon: true,
						icon: 'check-circle',
						onConfirm: () => this.$router.push('/Admin/Stations')
					})
				}
			})
			.catch(() => {
				console.log('FAIL')
			})
		}
	},
	computed: {
		isDisabled() {
      if (this.origData) {
				return (this.origData.station_name === this.name && 
				this.origData.description === this.description && 
				moment(this.origData.station_start, 'HH:mm').format('HH:mm') === moment(this.startTime, 'HH:mm').format('HH:mm') && 
				moment(this.origData.station_end, 'HH:mm').format('HH:mm') === moment(this.endTime, 'HH:mm').format('HH:mm') &&
				this.imageChanged === false) || !this.name || !this.description || !this.files[0]
			}
		},
		readImageFile() {
			if (!this.imageChanged) {
				this.imageurl = `http://${config.serverURL}/stations/getImage/${this.$route.params.id}`
			}
			else {
				this.imageurl = URL.createObjectURL(this.files[0])
			}
			return this.imageurl
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
	height: 30vh;
}

.image-section {
	padding: 24px;
}
</style>
