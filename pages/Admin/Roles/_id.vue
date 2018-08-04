<template>
	<section id="content" class="box">

		<!-- Add Role button -->
		<router-link to="/Admin/Roles/add" tag="button" id="addRoleBtn" class="button is-primary">
			<b-icon icon="plus-circle"></b-icon>
			<span>Add Role</span>
		</router-link>

		<!-- Filter by Station -->
		<b-field grouped group-multiline>
			<b-field label="Filter By Station:" style="margin-top: 5px;"></b-field>&nbsp;
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
			:default-sort="['station_name', 'asc']">

			<template slot-scope="props">
				<b-table-column field="station_name" label="Station Name" sortable>
					{{ props.row.station_name }}
				</b-table-column>

				<b-table-column field="role_name" label="Role" sortable>
					{{ props.row.role_name }}
				</b-table-column>

				<!-- <b-table-column field="durationInMins" label="Duration" sortable centered>
					{{ props.row.durationInMins + ' mins' }}
				</b-table-column> -->

				<b-table-column field="capacity" label="Capacity" sortable centered>
					{{ props.row.capacity }}
				</b-table-column>

				<b-table-column label="Actions" centered>
					<router-link v-if="$route.params['id']" :to="{ path: `/Admin/Roles/Update/${props.row.role_id}`}" tag="button" class="button is-primary is-small">Edit</router-link>
					<router-link v-else :to="{ path: `/Admin/Roles/Update/${props.row.role_id}`}" tag="button" class="button is-primary is-small">Edit</router-link>
				</b-table-column>
			</template>
		</b-table>

	</section>
</template>

<script>
import axios from 'axios'
import config from '~/config.js'

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
	async beforeMount() {
		this.$store.commit('setPageTitle', 'Manage Roles')

		let res = await this.$axios.get(`http://${config.serverURL}/roles/`)
		this.data = res.data[0]
		this.stationList = res.data[1]
		if (this.$route.params['id']) {
			this.data.filter(i => i.station_id === parseInt(this.$route.params['id']))
			this.filter = this.data[0].station_name
		}
	},
	computed: {
		filteredData: function() {
			if (this.filter === 'All') {
				return this.data
			}
			return this.data.filter(i => i.station_name === this.filter)
		}
	}
}
</script>

<style scoped>
#addRoleBtn {
	float: right;
}
</style>
