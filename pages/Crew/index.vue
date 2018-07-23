<template>
  <section id="content"  class="box">
    <h1>{{ stationName }}</h1>
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
               v-model="filter"
               rounded>
      </b-input>
      </b-field>
    </b-field>


    <b-table
      :data = "bookingList"
      :row-class="(row, index) => row.booking_status === 'Admitted' && 'is-success'"
  
    >

      <template slot-scope="props">
        <b-table-column field="queue_no" label="Queue No." filterable width="150" sortable>
          {{ props.row.queue_no }}
        </b-table-column>

        <b-table-column field="role_name" label="Role Name" centered  sortable>
          {{ props.row.role_name }}
        </b-table-column>

        <b-table-column field="time_in" label="Time in" centered  sortable>
          {{ props.row.time_in }}
        </b-table-column>

        <b-table-column field="booking_status" label="Status" centered  sortable>
          {{ props.row.booking_status }}
        </b-table-column>
      </template>
    </b-table>
    


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
import moment from 'moment'
  export default{
    layout: 'crewMenu',
    methods: {
      setRefresh() {
           var day = new Date;
           var currentTime = moment(day).format('HH:mm:ss');   
           console.log(currenttime);   
           //console.log("currenttime",currentTime.duration.get('minutes'));
    
          
          //  setTimeout(function(){ alert("You"); }, 3000);
          //  if(currentTime.isAfter(this.sessionStartTime)){
     
          //    setTimeout(function(){ alert("You"); }, 3000);
          //  }else{
          var duration = moment.duration(currentTime.diff("19:12:10"));
                console.log(duration);
             var miliseconds = duration.as('milliseconds');
              console.log(miliseconds);
            setTimeout(function(){ alert("Hello"); }, 30000);
       //   }
       
                   
          // setTimeout(function(){
          //  this.$router.go(this.$router.curentRoute);
          // },60000)
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
        userBookingRoleName: "",
        userBookingStationName: "",
        userBookingIsBooked: false,
        userBookingSessionStartTime: "",
        userBookingSessionEndTime:"",
        apiAddress : "http://172.22.72.176:8000/bookings"
      }
    },
    created() {
      let theData;
      let startTime;
      let endTime;

      axios.get('http://172.22.42.223:8000/bookings/getbookinglist/1')
		  .then((res) => {
        if(res.status == "200") {
          console.log(res.data)
          console.log(res.data[0])
			    theData = res.data;
			    this.bookingList = theData;
          
         
          this.sessionStartTime = theData[0].session_start;       
          this.sessionEndTime = theData[0].session_end;
          this.stationName = theData[0].station_name;
          this.numberOfBooking = theData.length;
          this.setRefresh();

        }else{
          console.dir(res.status);
        }
			})
		.catch((err) => {
			console.log('FAILA')
      
		});
    },
    mounted() {
    let self = this;
    var isExist = false;
    let scannedID = "";
    let scannedArray = [];
    
    window.onkeypress = function(e) {
      if (e.key == 'Enter') {
       
        scannedID = scannedArray.join('');
         console.log(scannedID);
        for(var i in this.bookingList){
          console.log("inside for loop");
          if(this.bookingList[i].rfid=scannedID){
            isExist = true;
            var booking_id = his.bookingList[i].booking_id;
            this.bookingList[i].booking_status = "Admitted";
             var day = new Date;
            this.bookingList[i].time_in = moment(day).format('HH:mm');
            let webFormData = new WebFormData(this.bookingList[i].booking_status, this.bookingList[i].time_in)
			
			let formData = new FormData()
			//console.log(formData)
			formData.append(webFormData.name)
			formData.append('webFormData', JSON.stringify(webFormData))
			console.log(webFormData)
			axios.put('http://localhost:8000/bookings/' + booking_id,
				formData
			).then((res) => {
				// console.log(res.data)

			})
			.catch(() => {
				console.log('FAILURE')
			})
          }
        }
      }
      if(isExist==false){
            let booking;
            axios.get(`http://localhost:8000/bookings/` + scannedID)
              .then((res) => {
                if(res.status == "200") {
                   console.log(res.data)
                  if(res!=null){
                    booking = res.data[0];
                    this.userBookingRoleName = booking.role_name;
                    this.userBookingStationName = booking.station_name;
                    this.userBookingSessionStartTime = booking.session_start;
                    this.userBookingSsessionEndTime = booking.session_end;
                    this.$dialog.alert({
						        title: 'Wrong Booking',
						        message: 'You have a booking as ' + this.userBookingRoleName + ' at ' + this.userBookingStationName +" from " + this.userBookingRSessionStartTime +" to "+ this.userBookingSessionEndTime,
						        type: 'is-danger',
						        hasIcon: true,
						        icon: 'times-circle',
						        iconPack: 'fa'
                    });
                  }else{
                    this.$toast.open({
                    duration: 5000,
                    message: 'User does not have any bookings!',
                    position: 'is-bottom',
                    type: 'is-danger'
                    })       
                }
              }
                else {
 
                  console.dir(res.status);
 
					      }
				   
     
              })
              .catch((err) => {
                console.log('FailAA');
                booking = null;
                this.$toast.open({
                duration: 5000,
                message: 'User does not have any bookings!',
                position: 'is-bottom',
                type: 'is-danger'
                }) 
              });           
        
      } else {
        scannedArray.push(e.key);
      }
    }
  },

    
    computed:{
      numberOfConfirm() {
        var count = 0;
          for (var i in this.bookingList) {
            if(this.bookingList[i].booking_status === "Admitted"){
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

</style>
