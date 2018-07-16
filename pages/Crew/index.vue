<template>
  <section id="content"  class="box">

    <b-field grouped>
      <b-field expanded>
      <button class="button is-white" onclick="false">
        <b-icon icon="clock" size="is-medium"></b-icon>
        <span> {{ seesionStartTime }} to {{ sessionEndTime }} </span>
      </button>
      </b-field>


      <b-field expanded>
      <b-input placeholder="Search for a queue number"
               type="search"
               icon="magnify"
               rounded>
      </b-input>
      </b-field>
    </b-field>


    <b-table
      :data = "tableDataSimple"
      :row-class="(row, index) => row.status === 'Confirmed' && 'is-success'"
      :checked-rows.sync="checkedRows"
      checkedRows
    >

      <template slot-scope="props">
        <b-table-column field="queue_No" label="Queue No." width="150" sortable>
          {{ props.row.queue_No }}
        </b-table-column>

        <b-table-column field="role_name" label="Role Name" centered>
          {{ props.row.role_name }}
        </b-table-column>

        <b-table-column field="time_in" label="Time in" centered>
          {{ props.row.time_in }}
        </b-table-column>

        <b-table-column field="status" label="Status" centered>
          {{ props.row.status }}
        </b-table-column>
      </template>
    </b-table>


    <!--<button class="button is-medium is-danger" @click="danger">-->
    <!--Launch toast (custom)-->
    <!--</button>-->

    <b-field id="attendance">
      <b>Total checked</b>: 6/9
    </b-field>

  </section>
</template>

<script>
import axios from 'axios'
  export default{
    layout: 'crewMenu',
    data() {
      const tableDataSimple = [
        { 'queue_No': 1000, 'role_name': 'Cabin Crew', 'time_in': '11:21AM', 'status': 'Confirmed' },
        { 'queue_No': 1001, 'role_name': 'Cabin Crew', 'time_in': '-', 'status': 'Pending' },
        { 'queue_No': 1000, 'role_name': 'Cabin Crew', 'time_in': '11:21AM', 'status': 'Confirmed' },
        { 'queue_No': 1000, 'role_name': 'Cabin Crew', 'time_in': '11:21AM', 'status': 'Confirmed' },
        { 'queue_No': 1000, 'role_name': 'Cabin Crew', 'time_in': '11:21AM', 'status': 'Confirmed' },
        { 'queue_No': 1000, 'role_name': 'Cabin Crew', 'time_in': '11:21AM', 'status': 'Confirmed' },
        { 'queue_No': 1000, 'role_name': 'Cabin Crew', 'time_in': '11:21AM', 'status': 'Confirmed' },
      ]
      return {
        tableDataSimple,
			  data: [],
			  filter: 'All',
			  bookingList: [],
        seesionStartTime,
        sessionEndTime,
        stationName,
        stationID,
      }
    },
	beforeCreate() {
		axios.get('http://localhost:8000/bookings/getbookinglist/1')
		.then((res) => {
			this.data = res.data[0]
			this.bookingList = res.data[1]
      this.seesionStartTime = res.data[1][1].session_start
			}
		})
		.catch(() => {
			console.log('FAIL')
		})
	},
	computed: {

	},
    methods:{
      danger() {
        this.$toast.open({
          duration: 5000,
          message: 'User does not have any bookings!',
          position: 'is-bottom',
          type: 'is-danger'
        })
      }


    }
  }
</script>

<style>
  #content {
    margin: 25px;
  }

  #attendance{
    margin-top: 20px;
    margin-left: 720px;
  }

  tr.is-success {
    background: #C0FFCF;
    color: #000;
  }

</style>
