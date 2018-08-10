<template>
<section id="content" class="box">

	<!-- Add Station button -->
	<router-link to="/Admin/Stations/Add" tag="button" id="addStationBtn" class="button is-primary">
		<b-icon icon="plus-circle"></b-icon>
		<span>Add Station</span>
	</router-link>

	<!-- Search by Station -->
	<b-field grouped group-multiline>
		<b-autocomplete id="searchBar" :data="filteredDataArray" placeholder="Search by Station" v-model="filter" type="search" icon="magnify" @select="option => selected = option" rounded>
			<template slot="empty">No results found</template>
		</b-autocomplete>
	</b-field>

	<b-table
		:data="filteredData"
		:paginated="paginated"
		:per-page="perPage"
		:mobile-cards="hasMobileCards"
		:current-page.sync="currentPage"
		default-sort-direction="asc"
		default-sort="station_id"
		detailed detail-key="station_id"
		hoverable>

		<template slot-scope="props">
			<b-table-column field="station_name" label="Station Name"  sortable>
				{{ props.row.station_name }}
			</b-table-column>

			<b-table-column field="station_start" label="Operating Hours" sortable centered>
				{{ props.row.station_start.slice(0,5) + ' - ' + props.row.station_end.slice(0,5) }}
			</b-table-column>

			<b-table-column field="durationInMins" label="Activity Duration" sortable centered>
				{{ props.row.durationInMins + ' mins' }}
			</b-table-column>

			<b-table-column field="noOfRoles" label="No. of Roles" sortable centered>
				{{ props.row.noOfRoles }}
			</b-table-column>

			<b-table-column field="is_active" label="Status" sortable centered>
				<span v-if="props.row.is_active===1" class="tag is-success">Active</span>
				<span v-else class="tag is-danger">Inactive</span>
			</b-table-column>

			<b-table-column label='Actions' centered>
				<b-dropdown position="is-bottom-left" >
					<button class="button is-primary is-small is-inverted" slot="trigger">
						<b-icon icon="dots-vertical"></b-icon>
					</button>

					<b-dropdown-item style="text-align: left" has-link paddingless>
						<router-link :to="{ path: `/Admin/Stations/Update/${props.row.station_id}`}">Edit</router-link>
					</b-dropdown-item>

					<b-dropdown-item style="text-align: left" has-link paddingless>
						<router-link :to="{ path: `/Admin/Roles/${props.row.station_id}`}">Manage Role(s)</router-link>
					</b-dropdown-item>

					<b-dropdown-item style="text-align: left" has-link paddingless>
						<router-link :to="{ path: `/Admin/Roles/add/${props.row.station_id}`}">Add Role</router-link>
					</b-dropdown-item>

					<b-dropdown-item style="text-align: left" has-link paddingless>
						<a @click="remove(props.row.station_id, props.row.station_name)">Delete</a>
					</b-dropdown-item>

					<hr />

					<b-dropdown-item style="text-align: left" has-link paddingless>
						<a v-if="props.row.is_active === 1"
						@click="updateStationStatus(props.row.station_id, props.row.station_name, 0)">Deactivate</a>

						<a v-else-if="props.row.is_active === 0"
						@click="updateStationStatus(props.row.station_id, props.row.station_name, 1)">Activate</a>
					</b-dropdown-item>
				</b-dropdown>
			</b-table-column>
		</template>

		<template slot="detail" slot-scope="props">
			<article class="media">
				<figure class="media-left">
					<p class="image is-64x64" style="margin-top: 10px;">
						<img :src="`http://${serverURL}/image/getStationImage/${props.row.station_id}`">
					</p>
				</figure>
				<div class="media-content">
					<div class="content">
						<p>
							<strong>{{ props.row.station_name }}</strong>
							<br>{{ props.row.description }}
						</p>
					</div>
				</div>
			</article>
		</template>
	</b-table>
</section>
</template>

<script>
import config from '~/config.js'
import moment from 'moment'

export default {
	data() {
		return {
			currentPage: 1,
			paginated: true,
			perPage: 5,
			hasMobileCards: true,
			data: [],
			autocompleteData: [],
			filter: '',
			serverURL: config.serverURL,
		}
	},
	async mounted() {
		let res = await this.$axios.get(`http://${config.serverURL}/stations/`)
		this.data = res.data
		for (let station of this.data) {
			this.autocompleteData.push(station.station_name)
		}
		this.$store.commit('setPageTitle', 'Manage Stations')
	},
	methods: {
		updateStationStatus(station_id, station_name, newActiveStatus) {
			let formData = {
				'newActiveStatus': newActiveStatus
			}
			let action = (newActiveStatus === 1) ? 'Activate' : 'Deactivate'
			let msg = (newActiveStatus === 0) ? `Warning! All slots will be removed for the day upon deactivation! 
				Are you sure you want to ${action.toLowerCase()} <b>${station_name}<b>?` : 
				`Are you sure you want to ${action.toLowerCase()} <b>${station_name}<b>?`
			this.$dialog.confirm({
				title: `${action} Station`,
				message: msg,
				confirmText: `${action} Station`,
				type: 'is-danger',
				hasIcon: true,
				onConfirm: () =>
				this.$axios.put(`http://${config.serverURL}/stations/activate/${station_id}`, formData)
					.then(res => {
						if (res.status === 200) {
							this.$dialog.alert({
								title: `${action} Station`,
								message: `Station has been successfully ${action + 'd'}`,
								type: 'is-success',
								hasIcon: true,
								icon: 'check-circle',
								iconPack: 'mdi',
								onConfirm: () => this.$router.go({path: '/Admin/Stations', force: true})
							})
						}
					})
					.catch(err => {
						console.log(err)
					})
			})
		},
		remove(station_id, station_name) {
			this.$dialog.confirm({
				title: 'Delete Station',
				message: 'Are you sure you want to permanently delete <b>' + station_name + '</b>?',
				confirmText: 'Delete Station',
				type: 'is-danger',
				hasIcon: true,
				onConfirm: () =>
				this.$axios.delete(`http://${config.serverURL}/stations/${station_id}`)
				.then(res => {
					if (res.status === 200) {
						this.$dialog.alert({
							title: 'Delete Station',
							message: '<b>' + station_name + '</b> has been successfully deleted',
							type: 'is-success',
							hasIcon: true,
							icon: 'check-circle',
							onConfirm: () => {
								for (let i in this.data) {
									if (parseInt(this.data[i].station_id) === parseInt(station_id)) {
										this.data.splice(i, 1)
										break
									}
								}
							}
						})
					}
				})
			})
		}
	},
	computed: {
		filteredData() {
			if (this.filter !== '') {
				return this.data.filter(i => i.station_name.toLowerCase().includes(this.filter.toLowerCase()))
			}
			return this.data
		},
		filteredDataArray() {
			return this.autocompleteData.filter((option) => {
				return option
					.toString()
					.toLowerCase()
					.indexOf(this.filter.toLowerCase()) >= 0
			})
		}
	}
}
</script>

<style scoped>
hr {
	margin: 0.2rem 0;
}

#addStationBtn {
	float: right;
}

/* @media only screen and (min-width:320px) and (max-width:767px) and (orientation:portrait) {
	#searchBar {
		width: 51vw;
	}
} */
</style>
