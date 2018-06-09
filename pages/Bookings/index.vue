<template>
  <section id="content" class="column is-four-fifths">
    <b-field grouped group-multiline>
      <b-select v-model="filter">
          <option>Aviation</option>
          <option>Piz</option>
      </b-select>
    </b-field>

    <b-table
      :data="filteredData"
      :paginated="isPaginated"
      :per-page="perPage"
      :current-page.sync="currentPage"
      :default-sort-direction="defaultSortDirection"
      default-sort="station_id">

      <template slot-scope="props">
        <b-table-column field="station_name" label="Station Name" sortable>
          {{ props.row.station_name }}
        </b-table-column>

        <b-table-column field="role_name" label="Role" sortable centered>
          <span class="tag is-success">
            {{ props.row.role_name }}
          </span>
        </b-table-column>

        <b-table-column field="time_slot" label="Session" sortable>
          {{ props.row.time_slot }}
        </b-table-column>

        <b-table-column field="date" label="Date" sortable>
          {{ props.row.date }}
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
      defaultSortDirection: 'asc',
      currentPage: 1,
      perPage: 5,
      filteredData: [],
      data: [],
      filter: ''
    }
  },
  beforeCreate() {
    axios.get('http://localhost:8000/bookings/')
    .then((res) => {
      console.log(res.data)
      this.data = res.data
      this.filteredData = res.data
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