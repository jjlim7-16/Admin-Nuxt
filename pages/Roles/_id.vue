<template>
  <!--<div class="column is-three-fifths" id="table">
    <b-table :data='data' :columns='columns'></b-table>
    <router-link to="/Stations/add" tag="button" class="button is-primary">Add Stations</router-link>
  </div>-->
  <section id="content" class="column is-four-fifths">
    <b-field grouped group-multiline>
      <b-select v-model="filter">
        <option>All</option>
        <option>Aviation</option>
        <option>KFC</option>
        <option>Pizza Hut</option>
      </b-select>
      <b-select v-model="perPage" :disabled="!isPaginated">
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="15">15 per page</option>
          <option value="20">20 per page</option>
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

        <b-table-column field="role_name" label="Role" sortable>
          {{ props.row.role_name }}
        </b-table-column>

        <b-table-column field="durationInMins" label="Duration" sortable centered>
          {{ props.row.durationInMins }}
        </b-table-column>

        <b-table-column field="capacity" label="Capacity" sortable centered>
          {{ props.row.capacity }}
        </b-table-column>

        <b-table-column label="Actions" centered>
          <router-link :to="{ path: `Update/${props.row.role_id}`}" tag="button" class="button is-primary is-small">Update Role</router-link>
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
      data: [],
      filter: 'All',
    }
  },
  beforeCreate() {
    axios.get('http://localhost:8000/roles/')
    .then((res) => {
      this.data = res.data
      if (this.$route.params['id']) {
        for (var i in this.data) {
          if (this.data[i].station_id === parseInt(this.$route.params['id'])) {
            this.filter = this.data[i].station_name
            break
          }
        }
      }
    })
    .catch(() => {
      console.log('FAIL')
    })
  },
  computed: {
    filteredData: function() {
      let data = []
      if (this.filter === 'All') {
        return this.data
      }
      for (var x in this.data) {
        if (this.data[x].station_name === this.filter) {
          data.push(this.data[x])
        }
      }
      return data
    }
  }
}
</script>

<style>

</style>
