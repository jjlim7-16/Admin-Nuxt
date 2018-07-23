<template>
	<section id="content" class="box" style="margin-left: 5px;">
		<b-field grouped group-multiline>
			<b-field label="Filter By Date:" style="margin-top: 5px;"></b-field>&nbsp;
			<b-select placeholder="Filter By Date" v-model="filter">
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
			default-sort-direction="asc"
			default-sort="date">

			<template slot-scope="props">
				<b-table-column field="session_date" label="Date" width="120" sortable>
					{{ props.row.session_date }}
				</b-table-column>

				<b-table-column field="station_name" label="Station Name" sortable>
					{{ props.row.station_name }}
				</b-table-column>

				<b-table-column field="role_name" label="Role Name" sortable>
					{{ props.row.role_name }}
				</b-table-column>

				<b-table-column field="booking_limit" label="Booking Limit" sortable>
					{{ props.row.booking_limit }}
				</b-table-column>

				<b-table-column label='Actions' width="150" centered>
					<b-dropdown>
						<button class="button is-primary is-small is-inverted" slot="trigger">
							<b-icon icon="dots-vertical"></b-icon>
						</button>

						<b-dropdown-item style="text-align: left" has-link>
							<router-link :to="{ path: `/Admin/Settings/Limit/Update/${props.row.limit_id}`}">
								Update Limit
							</router-link>
						</b-dropdown-item>
						<b-dropdown-item style="text-align: left" has-link>
							<a @click="deleteLimit(props.row.limit_id)">Delete Limit</a>
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
		<router-link to="/Admin/Settings/Limit/setLimit" tag="button" class="button is-primary">
			<b-icon icon="plus-circle"></b-icon>
			<span>Set New Limit</span>
		</router-link>
	</section>
</template>

<script>
import axios from 'axios'
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
		}
	},
	beforeCreate() {
		axios.get(`http://${config.serverURL}/limit/`)
		.then(res => {
			this.data = res.data[0]
			this.dateList = res.data[1]
		})
	},
	methods: {
		deleteLimit(limit_id) {
			this.$dialog.confirm({
				title: 'Delete Limit',
				message: 'Are you sure you want to delete this limitation?',
				confirmText: 'Delete Limit',
				type: 'is-danger',
				hasIcon: true,
				onConfirm: () => 
				axios.delete(`http://${config.serverURL}/limit/` + limit_id)
				.then(res => {
					if (res.status === 200) {
						this.$dialog.alert({
							title: 'Delete Limit',
							message: `The limit has been successfully deleted`,
							type: 'is-success',
							hasIcon: true,
							icon: 'check-circle',
							iconPack: 'mdi'
						})
						this.$router.go({path: '/Admin/Settings/Limit', force: true})
					}
				})
				.catch(err => {
					throw err
				})
			})
		}
	},
	computed: {
		filteredData() {
			if (this.filter !== null) {
				let data = []
				for (var i in this.data) {
					if (this.data[i].session_date.includes(this.filter)) {
						data.push(this.data[i])
					}
				}
				return data
			}
			return this.data
		},
		isEmpty() {
			if (this.filteredData === []) return true
			else return false
		}
	}
}
</script>
