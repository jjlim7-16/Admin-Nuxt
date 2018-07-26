<template>
	<section id="content" class="box">
		<div class="is-pulled-left">
			<b-field label='Station Name*' style="width: 410px">
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

			<b-field label="Description" width="410px">
				<b-input maxlength="500" type="textarea" v-model="description"></b-input>
			</b-field>

			<b-field label='Image' style="margin-top: -10px">
				<b-field class='file'>
					<b-upload v-model='files' accept="image/*" @input="imageChanged = true">
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

		<div class="is-pulled-right" id="img">
			<b-field label="Image">
				<b-upload v-model="files" drag-drop>
					<section class="section">
						<div class="content has-text-centered">
							<p><b-icon icon="upload" size="is-large"></b-icon></p>
							<p>Drop your image here or click to upload</p>
						</div>
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
			imageData: null,
			imageChanged: false,
			origData: null
		}
	},
	beforeCreate() {
		this.$store.commit('setPageTitle', 'Update Station')
		
		axios.get(`http://${config.serverURL}/stations/` + this.$route.params['id'])
    .then((res) => {
			let data = res.data[0]
			this.origData = data
			this.name = data.station_name
			this.description = data.description
			let start = new Date()
			start.setHours(data.station_start.slice(0,2))
			start.setMinutes(data.station_start.slice(3,5))
			this.startTime = start
			
			let end = new Date()
			end.setHours(data.station_end.slice(0,2))
			end.setMinutes(data.station_end.slice(3,5))
			this.endTime = end
    })
    .catch(() => {
      console.log('FAIL')
		})
		
		axios.get(`http://${config.serverURL}/stations/image`)
		.then(res => {
			if (res.status === 200) {
				let file = new File([res.data], 'image.png', {type: 'image/png'})
				this.files.push(file)
			}
		})
		.catch(e => {
			console.log(e)
		})
	},
	methods: {
		submit() {
			let webFormData = new DataModel.Station(this.name, this.description, 
			moment(this.startTime, 'HH:mm').format('HH:mm'), 
			moment(this.endTime, 'HH:mm').format('HH:mm'))
			
			let formData = new FormData()
			//console.log(formData)
			if (this.imageChanged === true) formData.append(webFormData.name, this.files[0])
			formData.append('webFormData', JSON.stringify(webFormData))
			console.log(formData.get('webFormData'))
			
			axios.put(`http://${config.serverURL}/stations/` + this.$route.params['id'],
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
				console.log('FAILURE')
			})
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
			axios.delete(`http://${config.serverURL}/stations/` + this.$route.params['id'])
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
				console.log('FAILURE')
			})
		}
	},
	computed: {
		isDisabled() {
      if (this.origData) {
				console.log(this.files[0])
				return (this.origData.station_name === this.name && 
				this.origData.description === this.description && 
				moment(this.origData.station_start, 'HH:mm').format('HH:mm') === moment(this.startTime, 'HH:mm').format('HH:mm') && 
				moment(this.origData.station_end, 'HH:mm').format('HH:mm') === moment(this.endTime, 'HH:mm').format('HH:mm') &&
				this.imageChanged === false)
			}
		}
	}
}
</script>
