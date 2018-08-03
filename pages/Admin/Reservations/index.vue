<template>
	<section id="content" class="box">

		<!-- Set Limit button -->
		<router-link to="/Admin/Reservations/add" tag="button" id="addBtn" class="button is-primary">
			<b-icon icon="plus-circle"></b-icon>
			<span>Make Reservation</span>
		</router-link>

		<!-- Filter by Date -->
		<b-field grouped group-multiline>
			<b-field label="Filter By Date:" style="margin-top: 0.9vh;"></b-field>&nbsp;
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
			:default-sort-direction="'asc'"
			:default-sort="['session_date', 'asc']">

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

				<b-table-column field="reservedFrom" label="Reserved Session" sortable centered>
					{{ props.row.reservedFrom.slice(0,5) + ' - ' + props.row.reservedTo.slice(0,5) }}
				</b-table-column>

				<b-table-column label='Actions' centered>
					<b-dropdown>
						<button class="button is-primary is-small is-inverted" slot="trigger">
							<b-icon icon="dots-vertical"></b-icon>
						</button>

						<b-dropdown-item style="text-align: left" has-link>
							<router-link :to="{path: `/Admin/Reservations/Update/${props.row.reservation_id}`}">
								Change Reservation
							</router-link>
						</b-dropdown-item>
						<b-dropdown-item style="text-align: left" has-link>
							<a @click="cancelReservation(props.row.reservation_id)">Cancel Reservation</a>
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
						<p>No Reservations Have Been Made</p>
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
	async beforeMount() {
		this.$store.commit('setPageTitle', 'Manage Reservations')

		let res = await this.$axios.get(`http://${config.serverURL}/reservations/`)
		this.data = res.data[0]
		this.dateList = res.data[1]
	},
	methods: {
		cancelReservation(reservation_id) {
			this.$dialog.confirm({
				title: 'Cancellation',
				message: 'Are you sure you want to cancel this reservation?',
				confirmText: 'Cancel Reservation',
				type: 'is-danger',
				hasIcon: true,
				onConfirm: () =>
				this.$axios.delete(`http://${config.serverURL}/reservation/` + reservation_id)
				.then(res => {
					if (res.status === 200) {
						this.$dialog.confirm({
							title: 'Cancellation',
							message: `The reservation has been successfully cancelled`,
							type: 'is-success',
							hasIcon: true,
							icon: 'check-circle',
							iconPack: 'mdi',
							onConfirm: () => this.$router.go({path: '/Admin/Reservations', force: true})
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
		filteredData() {
			if (this.filter !== null) {
				return this.data.filter(i => i.session_date === this.filter)
			}
			return this.data
		},
		isEmpty() {
			if (this.data.length === 0) return true
			else return false
		}
	}
}
</script>

<style scoped>
#addBtn {
	float: right;
}
</style>
