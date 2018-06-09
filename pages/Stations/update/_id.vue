<template>
	<section id="form">
		<b-field label='Station Name *' style="width: 410px">
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

    <b-field label='Image'>
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
	</section>
</template>

<script>
import axios from 'axios'

function WebFormData(name, description, noRSlots, startTime, endTime, roles, file) {
	this.name = name,
	this.description = description,
	this.noRSlots = noRSlots,
	this.startTime = startTime,
	this.endTime = endTime,
	this.roles = roles
	this.file = file
}

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
			files: []
		}
	},
	beforeCreate() {
		axios.get('http://localhost:8000/stations/' + this.$route.params['id'])
    .then((res) => {
			let data = res.data[0]
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
	},
	methods: {
		submit() {
			let webFormData = new WebFormData(this.name, this.description, 2, 
			this.startTime, this.endTime, this.roles, this.files[0])
			
			let formData = new FormData()
			//console.log(formData)
			formData.append(webFormData.name, webFormData.file)
			formData.append('webFormData', JSON.stringify(webFormData))
			
			axios.put('http://localhost:8000/stations/',
				formData
			).then((res) => {
				console.log(res)
				console.log('SUCCESS')
			})
			.catch(() => {
				console.log('FAILURE')
			})
			
		}
	},
	computed: {
		isDisabled() {
      return !this.name || !this.description
    }
	}
}
</script>

<style>
#form {
  float: left;
	margin: 25px 60px 25px 70px;
}
</style>