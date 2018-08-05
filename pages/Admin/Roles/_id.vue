<template>
	<section id="content" class="box">

		<!-- Add Role button -->
		<router-link to="/Admin/Roles/add" tag="button" id="addRoleBtn" class="button is-primary">
			<b-icon icon="plus-circle"></b-icon>
			<span>Add Role</span>
		</router-link>

		<!-- Filter by Station -->
		<b-field grouped group-multiline>
			<b-select v-model="filter" rounded>
				<option value="All">All Stations</option>
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

				<b-table-column field="capacity" label="Capacity" sortable centered>
					{{ props.row.capacity }}
				</b-table-column>

				<b-table-column label="Actions" centered>
					<b-dropdown position="is-bottom-left">
						<button class="button is-primary is-small is-inverted" slot="trigger">
							<b-icon icon="dots-vertical"></b-icon>
						</button>

						<b-dropdown-item style="text-align: left" has-link paddingless>
							<router-link :to="{ path: `/Admin/Roles/Update/${props.row.role_id}`}">Edit Role</router-link>
						</b-dropdown-item>
						
						<b-dropdown-item style="text-align: left" has-link paddingless>
							<a @click="remove(props.row.role_id)">Remove Role</a>
						</b-dropdown-item>
					</b-dropdown>
				</b-table-column>
			</template>
		</b-table>

	</section>
</template>

<script>
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
	},
	methods: {
		remove(role_id) {
			this.$dialog.confirm({
				title: 'Remove Role',
				message: 'Are you sure you want to remove this role?',
				confirmText: 'Remove Role',
				type: 'is-danger',
				hasIcon: true,
				onConfirm: () => this.confirmDelete(role_id)
			})
		},
		confirmDelete(role_id) {
			this.$axios.delete(`http://${config.serverURL}/roles/${role_id}`)
			.then(res => {
				if (res.status === 200) {
					this.$dialog.confirm({
						title: 'Remove Role',
						message: 'The Role: ' + this.name + ' has been removed successfully',
						type: 'is-success',
						hasIcon: true,
						icon: 'check-circle',
						onConfirm: () => this.$router.push('/Admin/Roles')
					})
				}
			})
		}
	}
}
</script>

<style scoped>
#addRoleBtn {
	float: right;
}
</style>
