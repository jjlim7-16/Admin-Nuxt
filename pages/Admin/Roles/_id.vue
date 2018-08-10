<template>
<section id="content" class="box">

  <!-- Add Role button -->
  <router-link to="/Admin/Roles/Add" tag="button" id="addRoleBtn" class="button is-primary">
    <b-icon icon="plus-circle"></b-icon>
    <span>Add Role</span>
  </router-link>

  <!-- Filter by Station -->
  <b-field grouped group-multiline>
    <b-select v-model="filter" placeholder="Filter by Station" rounded>
      <option value="All">All Stations</option>
      <option v-for="station in stationList" :key="station.station_name">
        {{station.station_name}}
      </option>
    </b-select>
  </b-field>

  <b-table
		:data="filteredData"
		:paginated="paginated"
		:per-page="perPage"
		:current-page.sync="currentPage"
		:default-sort="['station_name', 'asc']"
		hoverable>

    <template slot-scope="props">
				<b-table-column field="station_name" label="Station Name" sortable>
					{{ props.row.station_name }}
				</b-table-column>

				<b-table-column field="role_name" label="Role" sortable>
					{{ props.row.role_name }}
				</b-table-column>

				<b-table-column field="capacity" label="Capacity" sortable centered>
					{{ props.row.capacity }}
				</b-table-column>

				<b-table-column label="Actions" centered>
					<b-dropdown position="is-bottom-left">
						<button class="button is-primary is-small is-inverted" slot="trigger">
							<b-icon icon="dots-vertical"></b-icon>
						</button>

						<b-dropdown-item style="text-align: left" has-link paddingless>
							<router-link :to="{ path: `/Admin/Roles/Update/${props.row.role_id}`}">Edit</router-link>
						</b-dropdown-item>

						<b-dropdown-item style="text-align: left" has-link paddingless>
							<a @click="remove(props.row.station_id, props.row.role_id, props.row.role_name)">Delete</a>
						</b-dropdown-item>
					</b-dropdown>
				</b-table-column>
			</template>
  </b-table>

</section>
</template>

<script>
import config from '~/config.js'

export default {
  data() {
    return {
      currentPage: 1,
      perPage: 5,
      paginated: true,
      data: [],
      filter: null,
      stationList: []
    }
  },
  async mounted() {
    this.$store.commit('setPageTitle', 'Manage Roles')

    let res = await this.$axios.get(`http://${config.serverURL}/roles/`)
    this.data = res.data[0]
    this.stationList = res.data[1]
    if (this.$route.params['id']) {
      this.data.filter(i => i.station_id === parseInt(this.$route.params['id']))
      this.filter = this.data[0].station_name
    }
  },
  computed: {
    filteredData: function() {
      if (this.filter === 'All' || !this.filter) {
        return this.data
      }
      return this.data.filter(i => i.station_name === this.filter)
    }
  },
  methods: {
    remove(station_id, role_id, role_name) {
      let oneRole = false
      let arr = []
      for (let i in this.data) {
        if (this.data[i].station_id === station_id) {
          arr.push(this.data[i].role_id)
        }
      }
      if (arr.length === 1) {
        this.$dialog.alert({
          title: 'Error',
          message: 'Each station requires at least one role',
          type: 'is-danger',
          hasIcon: true
        })
      } else {
        this.$dialog.confirm({
          title: 'Delete Role',
          message: 'Are you sure you want to permanently delete <b>' + role_name + '</b>?',
          confirmText: 'Delete Role',
          type: 'is-danger',
          hasIcon: true,
          onConfirm: () =>
            this.$axios.delete(`http://${config.serverURL}/roles/${role_id}`)
            .then(res => {
              if (res.status === 200) {
                this.$dialog.alert({
                  title: 'Delete Role',
                  message: '<b>' + role_name + '</b> has been successfully deleted',
                  type: 'is-success',
                  hasIcon: true,
                  icon: 'check-circle',
                  onConfirm: () => this.$router.go({
                    path: '/Admin/Roles',
                    force: true
                  })
                })
              }
            })
        })
      }
    }
  }
}
</script>

<style scoped>
#addRoleBtn {
  float: right;
}
</style>
