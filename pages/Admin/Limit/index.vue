<template>
	<section id="content" class="box">

		<!-- Set Limit button -->
		<router-link to="/Admin/Limit/Add" tag="button" id="setLimitBtn" class="button is-primary">
			<b-icon icon="plus-circle"></b-icon>
			<span>Set Limit</span>
		</router-link>

		<!-- Filter by Date -->
		<b-field grouped group-multiline>
			<b-select placeholder="Filter by Date" v-model="filter" rounded>
				<option value="All">All Dates</option>
				<option v-for="(date, index) in dateList" :key="index">
					{{ date.session_date }}
				</option>
			</b-select>
		</b-field>

		<b-table
			:data="isEmpty ? [] : filteredData"
			:paginated="paginated"
			:per-page="perPage"
			:current-page.sync="currentPage"
			:default-sort-direction="'asc'"
			:default-sort="['session_date', 'desc']">

			<template slot-scope="props">
				<b-table-column field="session_date" label="Date" sortable>
					{{ props.row.session_date }}
				</b-table-column>

				<b-table-column field="station_name" label="Station Name" sortable>
					{{ props.row.station_name }}
				</b-table-column>

				<b-table-column field="role_name" label="Role Name" sortable>
					{{ props.row.role_name }}
				</b-table-column>

				<b-table-column field="booking_limit" label="Booking Limit" centered sortable>
					{{ props.row.booking_limit }}
				</b-table-column>

				<b-table-column label='Actions' centered>
					<b-dropdown position="is-bottom-left">
						<button class="button is-primary is-small is-inverted" slot="trigger">
							<b-icon icon="dots-vertical"></b-icon>
						</button>

						<b-dropdown-item style="text-align: left" has-link paddingless>
							<router-link :to="{ path: `/Admin/Limit/Update/${props.row.limit_id}`}">Edit</router-link>
						</b-dropdown-item>
						<b-dropdown-item style="text-align: left" has-link paddingless>
							<a @click="deleteLimit(props.row.limit_id)">Delete</a>
						</b-dropdown-item>
					</b-dropdown>
				</b-table-column>
			</template>

			<template slot="empty">
				<section class="section">
					<div class="content has-text-grey has-text-centered">
						<p>
							<b-icon
								icon="emoticon-sad"
								size="is-large">
							</b-icon>
						</p>
						<p>No Limits Has Been Found</p>
					</div>
				</section>
			</template>
		</b-table>

	</section>
</template>

<script>

import moment from 'moment'
import config from '~/config.js'

export default {
	data() {
		return {
			data: [],
			dateList: [],
			filter: null,
			currentPage: 1,
			paginated: true,
			perPage: 5,
			date: new Date()
		}
	},
	async mounted() {
		this.$store.commit('setPageTitle', 'Manage Limits')

		let res = await this.$axios.get(`http://${config.serverURL}/limit/`)
		this.data = res.data[0]
		this.dateList = res.data[1]
	},
	methods: {
		deleteLimit(limit_id) {
			this.$dialog.confirm({
				title: 'Delete Limit',
				message: 'Are you sure you want to delete this limit set?',
				confirmText: 'Delete Limit',
				type: 'is-danger',
				hasIcon: true,
				onConfirm: () =>
				this.$axios.delete(`http://${config.serverURL}/limit/` + limit_id)
				.then(res => {
					if (res.status === 200) {
						this.$dialog.alert({
							title: 'Delete Limit',
							message: `The limit has been successfully deleted`,
							type: 'is-success',
							hasIcon: true,
							icon: 'check-circle',
							iconPack: 'mdi',
							onConfirm: () => this.$router.go({path: '/Admin/Limit', force: true})
						})
					}
				})
				.catch(err => {
					throw err
				})
			})
		}
	},
	computed: {
		filteredData: function() {
			if (this.filter === 'All' || !this.filter) {
				return this.data
			}
			return this.data.filter(i => i.session_date === this.filter)
		},
		isEmpty() {
			if (this.data.length === 0) return true
			else return false
		}
	}
}
</script>

<style scoped>
#setLimitBtn {
	float: right;
}
</style>
