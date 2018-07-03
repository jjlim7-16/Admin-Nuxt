<template>
	<section id="content" class="box column is-four-fifths">
		<b-field grouped group-multiline>
			<b-field label="Filter By Stations:" style="margin-top: 5px;"></b-field>&nbsp;
			<b-select v-model="filter">
				<option>All</option>
				<option v-for="station in stationList" :key="station.station_name">
					{{station.station_name}}
				</option>
			</b-select>
		</b-field>

		<b-table
			:data="filteredData"
			:paginated="paginated"
			:per-page="perPage"
			:current-page.sync="currentPage"
			default-sort-direction="asc"
			default-sort="station_id">

			<template slot-scope="props">
				<b-table-column field="station_name" label="Station Name" sortable>
					{{ props.row.station_name }}
				</b-table-column>

				<b-table-column field="role_name" label="Role" sortable>
					{{ props.row.role_name }}
				</b-table-column>

				<b-table-column field="durationInMins" label="Duration" sortable centered>
					{{ props.row.durationInMins }}
				</b-table-column>

				<b-table-column field="capacity" label="Capacity" sortable centered>
					{{ props.row.capacity }}
				</b-table-column>

				<b-table-column label="Actions" centered>
					<router-link v-if="$route.params['id']" :to="{ path: `/Admin/Roles/Update/${props.row.role_id}`}" tag="button" class="button is-primary is-small">Update Role</router-link>
					<router-link v-else :to="{ path: `/Admin/Roles/Update/${props.row.role_id}`}" tag="button" class="button is-primary is-small">Update Role</router-link>
				</b-table-column>
			</template>
		</b-table>
		<router-link to="/Admin/Roles/add" tag="button" class="button is-primary">Add Role</router-link>
	</section>
</template>

<script>
import axios from 'axios'

export default {
	data () {
		return {
			currentPage: 1,
			perPage: 5,
			paginated: true,
			data: [],
			filter: 'All',
			stationList: []
		}
	},
	beforeCreate() {
		axios.get('http://localhost:8000/roles/')
		.then((res) => {
			this.data = res.data[0]
			this.stationList = res.data[1]
			if (this.$route.params['id'] !== 'All') {
				for (var i in this.data) {
					if (this.data[i].station_id === parseInt(this.$route.params['id'])) {
						this.filter = this.data[i].station_name
						break
					}
				}
			}
		})
		.catch(() => {
			console.log('FAIL')
		})
	},
	computed: {
		filteredData: function() {
			if (this.filter === 'All') {
				return this.data
			}
			let data = []
			for (var x in this.data) {
				if (this.data[x].station_name === this.filter) {
					data.push(this.data[x])
				}
			}
			return data
		}
	}
}
</script>

<style>
#content {
	margin: 25px 60px 25px 70px;
}
</style>