<template>
	<section id="content" class="box" style="margin-left: 5px;">
		<b-field grouped group-multiline>
			<b-input placeholder="Search By Station Name" v-model="filter"></b-input>
		</b-field>

		<b-table
			:data="filteredData"
			:paginated="paginated"
			:per-page="perPage"
			:current-page.sync="currentPage"
			default-sort-direction="asc"
			default-sort="station_id">

			<template slot-scope="props">
				<b-table-column field="station_id" label="ID" width="50" sortable numeric>
					{{ props.row.station_id }}
				</b-table-column>

				<b-table-column field="station_name" label="Station Name" width="180" sortable>
					{{ props.row.station_name }}
				</b-table-column>

				<b-table-column field="station_start" label="Operating Hours" width="150" sortable centered>
					{{ props.row.station_start.slice(0,5) + ' - ' + props.row.station_end.slice(0,5) }}
				</b-table-column>
				
				<b-table-column field="is_active" label="Status" width="150" sortable centered>
					<span v-if="props.row.is_active===1" class="tag is-success">Active</span>
					<span v-else class="tag is-success">Inactive</span>
				</b-table-column>
				
				<!-- <b-table-column field="is_active" label="Status" width="150" centered>
					<b-switch v-if="props.row.is_active===1" :value='true'></b-switch>
					<b-switch v-else :value='false'></b-switch>
				</b-table-column> -->

				<b-table-column label='Actions' width="150" centered>
					<b-dropdown>
						<button class="button is-primary is-small is-inverted" slot="trigger">
							<b-icon icon="dots-vertical"></b-icon>
						</button>

						<b-dropdown-item style="text-align: left" has-link>
							<router-link :to="{ path: `/Admin/Stations/Update/${props.row.station_id}`}">
								Update Stations
							</router-link>
						</b-dropdown-item>
						<b-dropdown-item style="text-align: left" has-link>
							<router-link :to="{ path: `/Admin/Roles/add/${props.row.station_id}`}">Add Role</router-link>
						</b-dropdown-item>
						<b-dropdown-item style="text-align: left" has-link>
							<router-link :to="{ path: `/Admin/Roles/${props.row.station_id}`}">Manage Roles</router-link>
						</b-dropdown-item>
					</b-dropdown>
				</b-table-column>
			</template>
		</b-table>
		<router-link to="/Admin/Stations/add" tag="button" class="button is-primary">Add Stations</router-link>
	</section>
</template>

<script>
import axios from 'axios'
import FileSaver from 'file-saver'

export default {
	data () {
		return {
			currentPage: 1,
			paginated: true,
			perPage: 5,
			data: [],
			filter: ''
		}
	},
	beforeCreate() {
		axios.get('http://localhost:8000/stations/')
		.then((res) => {
			// console.log(res.data)
			this.data = res.data
			// return axios.get('http://localhost:8000/stations/image', {
			// 	headers: {
			// 		'Content-type': 'application/json',
			// 		'Accept': 'image/jpeg'
			// 	}
			// })
		})
		// .then(res => {
		// 	console.log('Saving File..')
		// 	const blob = new Blob([res.data], {
		// 		type: 'image/jpeg'
		// 	})
		// 	// console.log(blob)
		// 	// FileSaver.saveAs(blob, '../../../assets/images/test.jpeg')
		// 	let fileReader = new FileReader()
		// 	let image = fileReader.readAsDataURL(blob)
		// 	// this.FileSaver.saveAs(blob, 'testing.jpeg')
		// 	// this.data = res.data
		// })
		.catch(() => {
			console.log('FAIL')
		})
	},
	computed: {
		filteredData() {
			if (this.filter !== '') {
				let data = []
				for (var i in this.data) {
					if (this.data[i].station_name.toLowerCase().includes(this.filter.toLowerCase())) {
						data.push(this.data[i])
					}
				}
				return data
			}
			return this.data
		}
	}
}
</script>
