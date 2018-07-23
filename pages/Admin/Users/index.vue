<template>
  <section id="content" class="box">

    <b-field>
      <router-link to="/Admin/Users/add" tag="button" class="button is-danger" id="btnAddUser">
        <b-icon icon="plus-circle"></b-icon>
        <span>Add User</span>
      </router-link>

    </b-field>

    <div class="shadow">
      <div class="tableContent">

    <b-table
      :data = "tableDataSimple"
      striped
      hoverable
    >

      <template slot-scope="props">
        <b-table-column class="row" field="username" label="Username"  sortable>
          {{ props.row.username }}
        </b-table-column>

        <b-table-column field="station_name" label="Station Name" centered sortable>
          {{ props.row.station_name }}
        </b-table-column>

        <b-table-column field="role" label="Role"  centered sortable>
          {{ props.row.role }}
        </b-table-column>

        <b-table-column field="password" label="Password"  centered sortable>
          {{ props.row.password }}
        </b-table-column>

        <b-table-column field="last_logged_in" label="Last Logged In" centered  sortable>
          <span >{{ new Date(props.row.last_logged_in).toLocaleDateString()}} </span>
        </b-table-column>

        <b-table-column field="action" label="Action"  centered>
            <router-link to="/Admin/Users/edit" tag="button" class="button is-primary">
              <span> {{ props.row.action }}Edit</span>
            </router-link>

          <button class="button is-white"></button>

          <button class="button is-danger" @click="confirmCustomDelete">
            <span> {{ props.row.action }}Delete</span>
          </button>
        </b-table-column>
      </template>
    </b-table>
      </div>
    </div>
  </section>
</template>


<script>
import config from '~/config.js'

  export default{
    layout: 'default',
    data() {
      const tableDataSimple = [
        { 'username': 'op-kenneth', 'station_name': 'ALL', 'role': 'Admin', 'password': '*****','last_logged_in':'05/19/2018  12:00' },
        { 'username': 'op-kenneth', 'station_name': 'ALL', 'role': 'Admin', 'password': '*****','last_logged_in':'05/19/2018  12:00' },
      ]
      return {
        tableDataSimple,
      }
    },

    methods:{
      confirmCustomDelete() {
        this.$dialog.confirm({
          title: 'Deleting account',
          message: 'Are you sure you want to <b>delete</b> your account? This action cannot be undone.',
          confirmText: 'Delete Account',
          type: 'is-danger',
          hasIcon: true,
          onConfirm: () => this.$toast.open('Account deleted!')
        })
      }

    }
  }
</script>

<style>
  #content {
    margin: 15px;
  }
#table{
  outline: #47494e 5px;
}

  #btnAddUser{
    margin-left: 820px;
  }


  .shadow {
    margin: 40px;
    background-color: #fff; /* Needed for IEs */

    -moz-box-shadow: 5px 5px 5px #fff;
    -webkit-box-shadow: 5px 5px 5px #fff;
    box-shadow: 5px 5px 5px #fff;

    filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=3,MakeShadow=true,ShadowOpacity=0.30);
    -ms-filter: "progid:DXImageTransform.Microsoft.Blur(PixelRadius=3,MakeShadow=true,ShadowOpacity=0.30)";
    zoom: 1;
  }

  .shadow .tableContent {
    position: relative; /* This protects the inner element from being blurred */
    padding: 2px;
    background-color: #DDD;
  }
</style>
