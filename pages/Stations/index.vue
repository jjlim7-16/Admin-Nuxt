<template>
  <!--<div class="column is-three-fifths" id="table">
    <b-table :data='data' :columns='columns'></b-table>
    <router-link to="/Stations/add" tag="button" class="button is-primary">Add Stations</router-link>
  </div>-->
  <section id="content">
    <b-field grouped group-multiline>
      <b-select v-model="defaultSortDirection">
          <option value="asc">Default sort direction: ASC</option>
          <option value="desc">Default sort direction: DESC</option>
      </b-select>
      <b-select v-model="perPage" :disabled="!isPaginated">
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="15">15 per page</option>
          <option value="20">20 per page</option>
      </b-select>
      <div class="control">
          <button class="button" @click="currentPage = 2" :disabled="!isPaginated">Set page to 2</button>
      </div>
      <div class="control is-flex">
          <b-switch v-model="isPaginated">Paginated</b-switch>
      </div>
      <div class="control is-flex">
          <b-switch v-model="isPaginationSimple" :disabled="!isPaginated">Simple pagination</b-switch>
      </div>
    </b-field>

    <b-table
      :data="data"
      :paginated="isPaginated"
      :per-page="perPage"
      :current-page.sync="currentPage"
      :pagination-simple="isPaginationSimple"
      :default-sort-direction="defaultSortDirection"
      default-sort="station_id">

      <template slot-scope="props">
        <b-table-column field="station_id" label="ID" width="40" sortable numeric>
          {{ props.row.station_id }}
        </b-table-column>

        <b-table-column field="station_name" label="Station Name" sortable>
          {{ props.row.station_name }}
        </b-table-column>

        <b-table-column field="(station_start)" label="Start Time" sortable centered>
          <span class="tag is-success">
            {{ props.row.station_start }}
          </span>
        </b-table-column>

        <b-table-column field="station_end" label="End Time" sortable centered>
          <span class="tag is-success">
            {{ props.row.station_end }}
          </span>
        </b-table-column>

        <b-table-column label='Actions'>
          <b-dropdown>
            <button class="button is-primary is-inverted" slot="trigger">
              <b-icon icon="dots-vertical"></b-icon>
            </button>

            <b-dropdown-item>
              <router-link :to="{ path: `Stations/Update/${props.row.station_id}`}">
                Update Stations
              </router-link>
            </b-dropdown-item>
            <b-dropdown-item>
              <router-link :to="{ path: `Roles/${props.row.station_id}`}">Manage Roles</router-link>
            </b-dropdown-item>
          </b-dropdown>
        </b-table-column>
        <!-- <b-table-column field="station_name" label="Actions" centered>
          <router-link :to="{ path: `Stations/Update/${props.row.station_id}`}" tag="button" class="button is-primary">Update Stations</router-link>
        </b-table-column> -->
      </template>
    </b-table>
    <router-link to="/Stations/add" tag="button" class="button is-primary">Add Stations</router-link>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      isPaginated: true,
      isPaginationSimple: false,
      defaultSortDirection: 'asc',
      currentPage: 1,
      perPage: 5,
      data: []
    }
  },
  beforeCreate() {
    axios.get('http://localhost:8000/stations/')
    .then((res) => {
      console.log(res.data)
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
  margin: 120px 60px 25px 100px;
}
</style>
