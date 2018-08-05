<template>
	<section id="content" class="box">
		<router-link to="/Admin/Users/add" tag="button" class="button is-primary is-pulled-right" id="btnAddUser">
			<b-icon icon="plus-circle"></b-icon>
			<span>Add User</span>
		</router-link>

		<b-field grouped group-multiline>
			<b-input placeholder="Search By Username" v-model="filter" rounded></b-input>
		</b-field>

		<b-table
			:data = "userData"
			:paginated="paginated"
			:per-page="perPage"
			:current-page.sync="currentPage"
			default-sort-direction="asc"
			default-sort="['role', 'desc']"
			hoverable>

			<template slot-scope="props">
				<b-table-column field="username" label="Username"  sortable>
					{{ props.row.username }}
				</b-table-column>

				<b-table-column field="role" label="Role"  sortable>
					{{ props.row.account_type }}
				</b-table-column>

				<b-table-column field="station" label="Station" sortable>
					{{ props.row.station_name}}
				</b-table-column>

				<b-table-column field="action" label="Action" centered>
					<b-dropdown position="is-bottom-left" >
						<button class="button is-primary is-small is-inverted" slot="trigger">
							<b-icon icon="dots-vertical"></b-icon>
						</button>

						<b-dropdown-item style="text-align: left" has-link>
							<router-link :to="{ path: `/Admin/Users/edit/${props.row.user_id}`}">
								<span>Edit</span>
							</router-link>
						</b-dropdown-item>

						<b-dropdown-item style="text-align: left" has-link paddingless>
							<a @click="deleteAccount(props.row.user_id)">Delete</a>
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
			paginated: true,
			perPage: 5,
			data: [],
			filter: '',
			stationList: null
		}
	},
	async beforeMount() {
		let res = await this.$axios.get(`http://${config.serverURL}/user/`)
		this.data = res.data
		this.stationList = res.data[1]
		console.log(this.stationList)
		for (var i in this.data) {
			if (this.data[i].station_id != null) {
				for (var a in this.stationList) {
					if (this.stationList[a].station_id == this.data[i]) {
						this.data[i].station_name = this.stationList[a].station_name
					}
				}
			} else {
				this.data[i].station_name = "-"
			}
		}
		this.$store.commit('setPageTitle', 'Manage Users')
	},

	methods:{
		deleteAccount(user_id) {
			this.$dialog.confirm({
				title: 'Delete User',
				message: 'Are you sure you want to delete this User?',
				confirmText: 'Delete User',
				type: 'is-danger',
				hasIcon: true,
				onConfirm: () =>
					this.$axios.delete(`http://${config.serverURL}/user/` + user_id)
					.then(res => {
						if (res.status === 200) {
							this.$dialog.alert({
								title: 'Delete Account',
								message: `The user account has been successfully deleted`,
								type: 'is-success',
								hasIcon: true,
								icon: 'check-circle',
								iconPack: 'mdi'
							})
							this.$router.go({path: '/Admin/Users', force: true})
						}
					})
					.catch(err => {
						throw err
					})
			})
		}
	},
	computed: {
		userData() {
			if (this.filter !== '') {
				let data = []
				for (var i in this.data) {
					if (this.data[i].username.toLowerCase().includes(this.filter.toLowerCase())) {
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
