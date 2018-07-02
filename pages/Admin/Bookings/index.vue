<template>
  <section id="content" class="column is-four-fifths">
    <b-field grouped group-multiline>
			<b-input placeholder="Filter By Queue No." v-model="filter"></b-input>
		</b-field>

    <b-table
      :data="data"
      :paginated="isPaginated"
      :per-page="perPage"
      :current-page.sync="currentPage"
      default-sort-direction="asc"
      default-sort="station_id">

      <template slot-scope="props">
        <b-table-column field="session_date" label="Date" sortable>
          {{ props.row.session_date }}
        </b-table-column>
        
        <b-table-column field="station_name" label="Station" sortable centered>
          {{ props.row.station_name }}
        </b-table-column>
        
        <b-table-column field="role_name" label="Role" sortable centered>
          {{ props.row.role_name }}
        </b-table-column>
        
        <b-table-column field="rfid" label="RFID">
          {{ props.row.rfid }}
        </b-table-column>

        <b-table-column field="queue_no" label="Queue No." sortable>
          {{ props.row.queue_no }}
        </b-table-column>

        <b-table-column field="booking_status" label="Booking Status" sortable>
          <span v-if="props.row.booking_status === 'Confirmed'" class="tag is-success">
						{{ props.row.booking_status }}
					</span>
          <span v-else class="tag is-danger">
						{{ props.row.booking_status }}
					</span>
        </b-table-column>
      </template>
    </b-table>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      isPaginated: true,
      currentPage: 1,
      perPage: 10,
      data: [],
      filter: ''
    }
  },
  beforeCreate() {
    axios.get('http://localhost:8000/bookings/')
    .then((res) => {
      this.data = res.data
    })
    .catch(() => {
      console.log('FAIL')
    })
  }
}
</script>

<style>
#content {
  margin: 25px 60px 25px 70px;
}
</style>