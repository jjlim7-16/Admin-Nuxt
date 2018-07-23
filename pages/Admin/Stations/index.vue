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
			default-sort="station_id"
			detailed
			detail-key="station_id">

			<template slot-scope="props">
				<b-table-column field="station_name" label="Station Name" width="180" sortable>
					{{ props.row.station_name }}
				</b-table-column>

				<b-table-column field="station_start" label="Operating Hours" width="150" sortable centered>
					{{ props.row.station_start.slice(0,5) + ' - ' + props.row.station_end.slice(0,5) }}
				</b-table-column>
				
				<b-table-column field="is_active" label="Status" width="150" sortable centered>
					<span v-if="props.row.is_active===1" class="tag is-success">Active</span>
					<span v-else class="tag is-danger">Inactive</span>
				</b-table-column>
				
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
						<b-dropdown-item style="text-align: left" has-link>
							<a v-if="props.row.is_active === 1" @click="updateStationStatus(props.row.station_id, 0)">Deactivate Station</a>
							<a v-else-if="props.row.is_active === 0" @click="updateStationStatus(props.row.station_id, 1)">Activate Station</a>
						</b-dropdown-item>
					</b-dropdown>
				</b-table-column>
			</template>

			<template slot="detail" slot-scope="props">
				<article class="media">
					<figure class="media-left">
						<p class="image is-64x64" style="margin-top: 10px;">
							<img :src="'http://25.37.100.106:8000/stations/getImage/' + props.row.station_id">
						</p>
					</figure>
					<div class="media-content">
						<div class="content">
							<p>
								<strong>{{ props.row.station_name }}</strong>
								<br>
								{{ props.row.description }}
							</p>
						</div>
					</div>
				</article>
			</template>
		</b-table>
		<router-link to="/Admin/Stations/add" tag="button" class="button is-primary">
			<b-icon icon="plus-circle"></b-icon>
			<span>Add Station</span>
		</router-link>
	</section>
</template>

<script>
import axios from 'axios'
import FileSaver from 'file-saver'
import config from '~/config.js'

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
		axios.get(`http://${config.serverURL}/stations/`)
		.then((res) => {
			this.data = res.data
		})
		.catch(() => {
			console.log('FAIL')
		})
		this.$store.commit('setPageTitle', 'Manage Stations')
	},
	methods: {
		updateStationStatus(station_id, newActiveStatus) {
			let formData = { 'newActiveStatus': newActiveStatus }
			let action = (newActiveStatus === 1) ? 'Activate' : 'Deactivate'
			this.$dialog.confirm({
				title: `${action} Station`,
				message: `Are you sure you want to ${action.toLowerCase()} this station?`,
				confirmText: `${action} Station`,
				type: 'is-danger',
				hasIcon: true,
				onConfirm: () => axios.put(`http://${config.serverURL}/stations/activate/` + station_id, formData)
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
						axios.get(`http://${config.serverURL}/stations/`)
						.then((res) => {
							this.data = res.data
						})
						.catch(() => {
							console.log('FAIL')
						})
					}
				})
			})
			
		}
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
