<template>
  <section id="content"  class="box">

    <b-field grouped>
      <b-field expanded>
      <button class="button is-white" onclick="false">
        <b-icon icon="clock" size="is-medium"></b-icon>
        <span> {{ sessionStartTime }} to {{ sessionEndTime }} </span>
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
      :data = "bookingList"
      :row-class="(row, index) => row.booking_status === 'Confirmed' && 'is-success'"
      :checked-rows.sync="checkedRows"
      checkedRows


    >

      <template slot-scope="props">
        <b-table-column field="queue_no" label="Queue No." width="150" sortable>
          {{ props.row.queue_no }}
        </b-table-column>

        <b-table-column field="role_name" label="Role Name" centered sortable>
          {{ props.row.role_name }}
        </b-table-column>

        <b-table-column field="time_in" label="Time in" centered sortable>
          {{ props.row.time_in }}
        </b-table-column>

        <b-table-column field="booking_status" label="Status" centered>
          {{ props.row.booking_status }}
        </b-table-column>
      </template>
    </b-table>

  </div>
</div>
    <!--<button class="button is-medium is-danger" @click="danger">-->
    <!--Launch toast (custom)-->
    <!--</button>-->

    <b-field id="attendance">
      <b>Total checked</b>: {{ numberOfConfirm }}/{{ numberOfBooking }}
    </b-field>

  </section>
</template>

<script>
import axios from 'axios'
import config from '~/config.js'

  export default{
    layout: 'crewMenu',
    methods: {
      danger() {
        this.$toast.open({
          duration: 5000,
          message: 'User does not have any bookings!',
          position: 'is-bottom',
          type: 'is-danger'
        })
      }
    },
    data(){
      return {
			  bookingList: [],
        sessionStartTime:"",
        sessionEndTime:"",
        stationName:"",
        stationID:"",
        numberOfBooking:0,
      }
    },
    created() {
      let theData;
      let startTime;
      let endTime;
      axios.get(`http://${config.serverURL}/bookings/getbookinglist/1`)
		  .then((res) => {
        if(res.status === 200) {
          console.log(res.data)
          console.log(res.data[0])
			    theData = res.data;
			    this.bookingList = theData;
         
          startTime = theData[0].session_start;
          var H = +startTime.substr(0, 2);
          var h = H % 12 || 12;
          var ampm = (H < 12 || H === 24) ? "AM" : "PM";
          this.sessionStartTime = h + startTime.substr(2, 3) + ampm;
          
          endTime = theData[0].session_end;
          H = +endTime.substr(0, 2);
          h = H % 12 || 12;
          ampm = (H < 12 || H === 24) ? "AM" : "PM";
          this.sessionEndTime = h + endTime.substr(2, 3) + ampm;

          this.numberOfBooking = theData.length;

        }else{
          console.dir(res.status);
        }
			})
		.catch((err) => {
			console.log('FAIL')
      console.log(err.message);
		});
    },
    computed:{
      numberOfConfirm() {
        var count = 0;
          for (var i in this.bookingList) {
            if(this.bookingList[i].booking_status === "Confirmed"){
              count++;
            }else{
            
            }
          }
          return count
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
