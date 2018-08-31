<template>
<section id="content" class="box">

	<!-- Search by rfid -->
	<b-field grouped group-multiline>
		<b-input placeholder="Search By RFID or Queue No." icon="magnify" v-model="filter" style="width: 20vw;" rounded></b-input>
		<button v-if="filter && filter !== ''" class="button is-danger" @click="clearSearch"><b-icon icon="close"></b-icon><span>Clear Search</span></button>
	</b-field>

	<b-table
		:data="filteredData"
		:paginated="paginated"
		:per-page="perPage"
		:mobile-cards="hasMobileCards"
		:current-page.sync="currentPage"
		default-sort-direction="asc"
		default-sort="booking_id"
		hoverable>

		<template slot-scope="props">
			<b-table-column field="rfid" label="RFID" sortable>
				{{ props.row.rfid }}
			</b-table-column>
			
			<!-- <b-table-column field="station_name" label="Station Name" sortable>
				{{ props.row.station_name }}
			</b-table-column> -->

			<b-table-column field="role_name" label="Role Name" sortable>
				{{ props.row.role_name }}
			</b-table-column>
			
			<b-table-column field="session_start" label="Session" sortable>
				{{ props.row.session_start.slice(0, 5) + ' - ' + props.row.session_end.slice(0,5) }}
			</b-table-column>

			<b-table-column field="queue_no" label="Queue No." centered sortable>
				{{ props.row.queue_no }}
			</b-table-column>

			<b-table-column field="booking_status" label="Booking Status" sortable centered>
				<span v-if="props.row.booking_status === 'Confirmed' || props.row.booking_status === 'Admitted'" class="tag is-success">{{ props.row.booking_status }}</span>
				<span v-else class="tag is-danger">{{ props.row.booking_status }}</span>
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
					<p>No Booking Has Been Found</p>
				</div>
			</section>
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
			perPage: 10,
			hasMobileCards: true,
			data: [],
			filter: '',
			serverURL: config.serverURL,
		}
	},
	async mounted() {
		let res = await this.$axios.get(`http://${config.serverURL}/bookings/`)
		this.data = res.data
		this.$store.commit('setPageTitle', `Today's Bookings`)
	},
	methods: {
		clearSearch() {
			this.filter = ''
		}
	},
	computed: {
		filteredData() {
			let search = this.filter.toLowerCase()
			if (this.filter !== '') {
				return this.data.filter(i => i.rfid.toLowerCase().includes(search) || i.queue_no.toLowerCase().includes(search))
				// return this.data.filter(i => i.rfid.toLowerCase().includes(search))
			}
			return this.data
		}
	}
}
</script>