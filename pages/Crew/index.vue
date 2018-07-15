<template>
  <section id="content"  class="box">

    <b-field grouped>
      <b-field expanded>
      <button class="button is-white" onclick="false">
        <b-icon icon="clock" size="is-medium"></b-icon>
        <span> 11:20AM to 11:40AM </span>
      </button>
      </b-field>


      <b-field expanded>
      <b-input placeholder="Search for a queue number"
               type="search"
               icon="magnify"
               rounded
               search-place-holder="searchPlaceHolder"
               >
      </b-input>
      </b-field>
    </b-field>

<div class="shadow">
  <div class="tableContent">
    <b-table
      :data = "tableDataSimple"
      :row-class="(row, index) => row.status === 'Confirmed' && 'is-success'"
      :checked-rows.sync="checkedRows"
      checkedRows


    >

      <template slot-scope="props">
        <b-table-column field="queue_No" label="Queue No." width="150" sortable >
          {{ props.row.queue_No }}
        </b-table-column>

        <b-table-column field="role_name" label="Role Name" centered sortable>
          {{ props.row.role_name }}
        </b-table-column>

        <b-table-column field="time_in" label="Time in" centered sortable>
          {{ props.row.time_in }}
        </b-table-column>

        <b-table-column field="status" label="Status" centered sortable>
          {{ props.row.status }}
        </b-table-column>
      </template>
    </b-table>

  </div>
</div>
    <!--<button class="button is-medium is-danger" @click="danger">-->
    <!--Launch toast (custom)-->
    <!--</button>-->

    <b-field id="attendance">
      <b>Total checked</b>: 6/7
    </b-field>

  </section>
</template>

<script>
  export default{
    layout: 'crewMenu',
    data() {
      const tableDataSimple = [
        { 'queue_No': 1000, 'role_name': 'Pilot', 'time_in': '11:21AM', 'status': 'Confirmed' },
        { 'queue_No': 1001, 'role_name': 'Cabin Crew', 'time_in': '-', 'status': 'Pending' },
        { 'queue_No': 1002, 'role_name': 'Pilot', 'time_in': '11:21AM', 'status': 'Confirmed' },
        { 'queue_No': 1003, 'role_name': 'Cabin Crew', 'time_in': '11:21AM', 'status': 'Confirmed' },
        { 'queue_No': 1004, 'role_name': 'Cabin Crew', 'time_in': '11:21AM', 'status': 'Confirmed' },
        { 'queue_No': 1005, 'role_name': 'Pilot', 'time_in': '11:21AM', 'status': 'Confirmed' },
        { 'queue_No': 1006, 'role_name': 'Cabin Crew', 'time_in': '11:21AM', 'status': 'Confirmed' },
      ]
      return {
        tableDataSimple,

      }
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
    },
    computed: {
      tableDataSimple() {
        if (this.filter !== '') {
          let data = []
          for (var i in this.data) {
            if (this.data[i].queue_No.includes(this.filter.toLowerCase())) {
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
