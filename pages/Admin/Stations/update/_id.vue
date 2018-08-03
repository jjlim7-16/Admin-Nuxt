<template>
	<section id="content" class="box columns">
		<div class="column is-6">
			<b-field label='Station Name*' :type="errors.has('name') ? 'is-danger': ''" 
				:message="errors.has('name') ? errors.first('name') : ''">
				<b-input placeholder='Enter Station Name' v-model="name" name="name" data-vv-as="'Station Name'"
				v-validate="'required|alpha_spaces'"></b-input>
			</b-field>

			<div class="columns">
				<div class="column is-half">
					<b-field label="Select Start Time">
						<b-timepicker v-model="startTime"
							:min-time='minTime'
							:max-time='maxTime'
							:increment-minutes=10>
						</b-timepicker>
					</b-field>
				</div>

				<div class="column is-half">
					<b-field label="Select End Time">
						<b-timepicker v-model="endTime"
							:min-time='minTime'
							:max-time='maxTime'
							:increment-minutes=10>
						</b-timepicker>
					</b-field>
				</div>
			</div>

			<b-field label='Duration'>
				<b-select expanded placeholder='Select Activity Duration' v-model="duration" rounded>
					<option value="15">15 mins</option>
					<option value="20">20 mins</option>
					<option value="25">25 mins</option>
					<option value="30">30 mins</option>
				</b-select>
			</b-field>

			<b-field label="Description" :type="errors.has('description') ? 'is-danger': ''" 
				:message="errors.has('description') ? errors.first('description') : ''">
				<b-input maxlength="500" rows="5" type="textarea" name="description" v-validate="'required'"
				data-vv-as="'Description'" v-model="description"></b-input>
			</b-field>

			<br/>
			<button class="button is-success" :disabled="isDisabled" @click="submit()">Update Station</button>
			&nbsp;&nbsp;
			<button class="button is-danger" @click='remove()'>Remove Station</button>
		</div>
		
		<div class="column is-4">
			<b-field label="Image">
				<b-upload v-model="files" @input="imageChanged = true" drag-drop>
					<section class="section" v-if="!files || files.length <= 0">
						<div class="content has-text-centered" id="preview">
							<p><b-icon icon="upload" size="is-large"></b-icon></p>
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
	</section>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import DataModel from '~/models/dataModel.js'
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
			duration: 15,
			files: [],
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
			this.duration = this.origData.durationInMins
			let start = new Date()
			start.setHours(this.origData.station_start.slice(0,2))
			start.setMinutes(this.origData.station_start.slice(3,5))
			this.startTime = start
			
			let end = new Date()
			end.setHours(this.origData.station_end.slice(0,2))
			end.setMinutes(this.origData.station_end.slice(3,5))
			this.endTime = end
			
			res = await this.$axios.get(`http://${config.serverURL}/stations/getImage/${this.$route.params.id}`, {
				responseType: 'blob'
			})
			let file = new File([res.data], 'image', { type: 'image/*' })
			this.files.push(file)

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
          moment(this.startTime, 'HH:mm').format('HH:mm'), moment(this.endTime, 'HH:mm').format('HH:mm'),
          this.duration)
				
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
				return (this.origData.station_name === this.name &&  this.origData.description === this.description && 
				moment(this.origData.station_start, 'HH:mm').format('HH:mm') === moment(this.startTime, 'HH:mm').format('HH:mm') && 
				moment(this.origData.station_end, 'HH:mm').format('HH:mm') === moment(this.endTime, 'HH:mm').format('HH:mm') &&
				this.imageChanged === false && this.duration === this.origData.durationInMins)
				|| !this.name || !this.description || !this.files[0]
			}
		},
		readImageFile() {
			if (this.files) {
				return URL.createObjectURL(this.files[0])
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
	height: 30vh;
}

.image-section {
	padding: 24px;
}
</style>
