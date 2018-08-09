<template>
	<section id="content" class="box">
		<router-link to="/Admin/Users/Add" tag="button" class="button is-primary is-pulled-right" id="btnAddUser">
			<b-icon icon="plus-circle"></b-icon>
			<span>Add User</span>
		</router-link>

		<b-field grouped group-multiline>
			<!-- Search by Username -->
			<b-input id="searchBar" placeholder="Search by Username" v-model="filter" rounded></b-input>
			<!-- Filter by User Role -->
			<b-select v-model="userFilter" placeholder="Filter by User" rounded>
				<option value="All">All User Roles</option>
				<option v-for="userRole in userRoleList" :key="userRole">
					{{userRole}}
				</option>
			</b-select>
		</b-field>

		<b-table
			:data="userData"
			:paginated="paginated"
			:per-page="perPage"
			:current-page.sync="currentPage"
			:default-sort-direction="'asc'"
			hoverable>

			<template slot-scope="props">
				<b-table-column field="username" label="Username"  sortable>
					<span v-if="$store.state.auth.user.user_id === props.row.user_id">{{ props.row.username + ' (me)' }}</span>
					<span v-else>{{ props.row.username }}</span>
				</b-table-column>

				<b-table-column field="role" label="User Role" sortable>
					{{ props.row.account_type }}
				</b-table-column>

				<b-table-column field="station" label="Station" sortable>
					<span v-if="props.row.station_name">{{ props.row.station_name }}</span>
					<span v-else>{{ '-' }}</span>
				</b-table-column>

				<b-table-column field="action" label="Action" centered>
					<b-dropdown position="is-bottom-left" >
						<button class="button is-primary is-small is-inverted" slot="trigger">
							<b-icon icon="dots-vertical"></b-icon>
						</button>

						<b-dropdown-item style="text-align: left" has-link>
							<router-link :to="`/Admin/Users/Update/${props.row.user_id}`">Edit</router-link>
						</b-dropdown-item>

						<b-dropdown-item style="text-align: left" has-link>
							<a @click="deleteAccount(props.row.user_id, props.row.account_type)">Delete</a>
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
			userRoleList: null,
			userFilter: null
		}
	},
	async mounted() {
		let res = await this.$axios.get(`http://${config.serverURL}/user/getFilteredUsers`)
		this.data = res.data
		this.userRoleList = [...new Set(res.data.map(item => item.account_type))]
		this.$store.commit('setPageTitle', 'Manage Users')
	},

	methods:{
		deleteAccount(user_id, account_type) {
			let curruser = this.$store.state.auth.user
			let authorised = false
			if (curruser.account_type === 'Admin' && account_type === 'Crew') {
				authorised = true
			}
			else if (curruser.user_id === user_id) {
				authorised = true
			}
			if (!authorised) {
				this.$dialog.alert({
					title: 'Unauthorised',
					message: 'You Are Unauthorised To Delete This Account',
					type: 'is-danger',
					hasIcon: true
				})
			}
			else {
				this.$dialog.confirm({
					title: 'Delete Account',
					message: 'Are you sure you want to delete this account?',
					confirmText: 'Delete Account',
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
									iconPack: 'mdi',
									onConfirm: () => this.$router.go({path: '/Admin/Users', force: true})
								})
							}
						})
						.catch(err => {
							throw err
						})
				})
			}
		}
	},
	computed: {
		userData() {
			if (this.filter !== '') {
				let data = []
				for (let i of this.data) {
					if (i.username.toLowerCase().includes(this.filter.toLowerCase())) {
						data.push(i)
					}
				}
				return data
			}
			else if (this.userFilter !== '' && this.userFilter !== 'All' && this.userFilter){
				let data = []
				for (let i of this.data) {
					if (i.account_type.toLowerCase().includes(this.userFilter.toLowerCase())) {
						data.push(i)
					}
				}
				return data
			}
			return this.data
		}
	}
}
</script>
