<template>
	<section id="content" class="box">

		<!-- Add Station button -->
		<router-link to="/Admin/Stations/add" tag="button" id="addStationBtn" class="button is-primary">
			<b-icon icon="plus-circle"></b-icon>
			<span>Add Station</span>
		</router-link>

		<!-- Search by Station -->
		<b-field grouped group-multiline>
			<b-input placeholder="Search By Station" v-model="filter" type="search" icon="magnify" rounded></b-input>
		</b-field>

		<b-table :data="filteredData" :paginated="paginated" :per-page="perPage" :mobile-cards="hasMobileCards"
		:current-page.sync="currentPage" default-sort-direction="asc"
		default-sort="station_id" detailed detail-key="station_id">

		<template slot-scope="props">
			<b-table-column field="station_name" label="Station Name"  sortable>
				{{ props.row.station_name }}
			</b-table-column>

			<b-table-column field="station_start" label="Operating Hours" sortable centered>
				{{ props.row.station_start.slice(0,5) + ' - ' + props.row.station_end.slice(0,5) }}
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
						<router-link :to="{ path: `/Admin/Stations/Update/${props.row.station_id}`}">Edit Station</router-link>
					</b-dropdown-item>
					<b-dropdown-item style="text-align: left" has-link paddingless>
						<router-link :to="{ path: `/Admin/Roles/${props.row.station_id}`}">Manage Role(s)</router-link>
					</b-dropdown-item>
					<b-dropdown-item style="text-align: left" has-link paddingless>
						<router-link :to="{ path: `/Admin/Roles/add/${props.row.station_id}`}">Add Role</router-link>
					</b-dropdown-item>
					<hr />
					<b-dropdown-item style="text-align: left" has-link paddingless>
						<a v-if="props.row.is_active === 1" @click="updateStationStatus(props.row.station_id, 0)">Deactivate</a>
						<a v-else-if="props.row.is_active === 0" @click="updateStationStatus(props.row.station_id, 1)">Activate</a>
					</b-dropdown-item>
				</b-dropdown>
			</b-table-column>
		</template>

		<template slot="detail" slot-scope="props">
			<article class="media">
				<figure class="media-left">
					<p class="image is-64x64" style="margin-top: 10px;">
						<img :src="`http://${serverURL}/stations/getImage/${props.row.station_id}`">
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
import axios from 'axios'
import config from '~/config.js'

export default {
	data () {
		return {
			currentPage: 1,
			paginated: true,
			perPage: 5,
			hasMobileCards: true,
			data: [],
			filter: '',
			serverURL: config.serverURL
		}
	},
	async beforeMount() {
		let res = await this.$axios.get(`http://${config.serverURL}/stations/`)
		this.data = res.data

		this.$store.commit('setPageTitle', 'Manage Stations')
	},
	methods: {
		updateStationStatus(station_id, newActiveStatus) {
			let formData = {
				'newActiveStatus': newActiveStatus
			}
			let action = (newActiveStatus === 1) ? 'Activate' : 'Deactivate'
			this.$dialog.confirm({
				title: `${action} Station`,
				message: `Are you sure you want to ${action.toLowerCase()} this station?`,
				confirmText: `${action} Station`,
				type: 'is-danger',
				hasIcon: true,
				onConfirm: () => this.$axios.put(`http://${config.serverURL}/stations/activate/` + station_id, formData)
				.then(res => {
					if (res.status === 200) {
						this.$dialog.alert({
							title: `${action} Station`,
							message: `Station Has Been Successfully ${action + 'd'}`,
							type: 'is-success',
							hasIcon: true,
							icon: 'check-circle',
							iconPack: 'mdi'
						})
						this.$axios.get(`http://${config.serverURL}/stations/`)
						.then((res) => {
							this.data = res.data
						})
					}
				})
				.catch(err => {
					console.log(err)
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

</style>
