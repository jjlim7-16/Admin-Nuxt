<template>
  <section id="content"  class="box">
    <h1>{{ stationName }}</h1>
    <b-field grouped>
      <b-field expanded>
      
      <button class="button is-white" onclick="false">
        <b-icon icon="clock" size="is-medium"></b-icon> &nbsp;
        <span v-if="haveSession"> <b>{{ sessionStartTime }} to {{ sessionEndTime }} </b> </span>    
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
      :data="isEmpty ? [] : filteredData"
    	:paginated="paginated"
			:per-page="perPage"
			:current-page.sync="currentPage"
      :row-class="(row, index) => row.booking_status === 'Admitted' && 'is-success-table'">

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

      	<template slot="empty">
				<section class="section">
					<div class="content has-text-grey has-text-centered">
						<p>
							<b-icon
								icon="emoticon-sad"
								size="is-large">
							</b-icon>
						</p>
						<p>No Bookings For the Session Has Been Found</p>
					</div>
				</section>
			</template>
    </b-table>
    

    <!--<button class="button is-medium is-danger" @click="danger">-->
    <!--Launch toast (custom)-->
    <!--</button>-->

    <b-field id="attendance">
      <b>Present</b>: {{ numberOfAdmit }}/{{ numberOfBooking }}
    </b-field>
  </section>
</template>

<script>
import axios from "axios";
import moment from "moment";
import config from "~/config";
import io from "~/plugins/socket-io.js";
let socket;

let scannedArray = [];
let scannedID = "";

export default {
  layout: "crewMenu",
  methods: {
  setRefresh() {
      if (this.sessionStartTime != null) {
        var day = new Date();
        var currentTime = moment(day, "HH:mm:ss");
        // this.sessionStartTime = "15:19:00";

        var refreshTime = moment(this.sessionEndTime, "HH:mm:ss").subtract(
          5,
          "minutes"
        );
        console.log(refreshTime);
        // if (currentTime.isAfter(refreshTime)) {
        //   console.log("current time is after nearest session start + 5mins");
        //   //   console.log(currentTime.diff(currentTime));

        //   this.$router.go();
        // } else {
        console.log("current time is before nearest session start + 5mins");
        var duration = moment.duration(refreshTime.diff(currentTime));

        var miliseconds = duration.as("milliseconds");
        console.log(miliseconds);
        this.updateNotAdmittedBookings();
        setTimeout(() => {
          this.$router.go();
        }, miliseconds);
        //}
      }
    },
    redirectToEndOfDay() {
      //redirect to another page at the end of day
    },
    updateNotAdmittedBookings() {
      for (var i in this.bookingList) {
        if (this.bookingList[i].booking_status == "Confirmed") {
          this.$axios
            .put(
              `http://${config.serverURL}/bookings/updateStatus/${
                this.bookingList[i].booking_id
              }`,
              {
                booking_status: "Not Admitted"
              }
            )
            .then(res => {
              // console.log(res.data)
            })
            .catch(() => {
              console.log("FAILURE");
            });
        }
      }
    }
  },
  data() {
    return {
      bookingList: [],
      sessionStartTime: "",
      sessionEndTime: "",
      stationName: "",
      stationID: 0,
      numberOfBooking: 0,
      errMessage: "",
      filter: "",
      currentPage: 1,
      paginated: true,
      perPage: 5,
      haveSession: true,
      userBookingRoleName: "",
      userBookingStationName: "",
      userBookingIsBooked: false,
      userBookingSessionStartTime: "",
      userBookingSessionEndTime: "",
      stationCloseTime: ""
    }
  },
  created() {
    if (this.$route.params["id"]) {
      this.stationID = parseInt(this.$route.params["id"]);
    }

    let theData;
    let startTime;
    let endTime;

    this.$axios
      .get(
        `http://${config.serverURL}/bookings/getbookinglist/${this.stationID}`
      )
      .then(res => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.length == 0) {
            this.$axios
              .get(
                `http://${config.serverURL}/sessions/nextSession/${
                  this.stationID
                }`
              )
              .then(res => {
                if (res.status === 200) {
                  if (res.data.length > 0) {
                    this.haveSession = true;
                    this.sessionStartTime = res.data[0].session_start.substr(
                      res.data[0].session_end,
                      5
                    );
                    console.log(res.data);
                    this.sessionEndTime = res.data[0].session_end.substr(
                      res.data[0].session_end,
                      5
                    );
                  } else {
                    //no more next session -  end of day
                    this.redirectToEndOfDay();
                    this.haveSession = false;
                  }
                }
              })
              .catch(err => {
                console.log("FAIL");
                this.haveSession = false;
              });
          } else {
            theData = res.data;
            this.bookingList = theData;

            this.sessionStartTime = theData[0].session_start.substr(
              theData[0].session_start,
              5
            );

            this.sessionEndTime = theData[0].session_end.substr(
              theData[0].session_end,
              5
            );
            this.stationName = theData[0].station_name;
            this.numberOfBooking = theData.length;
            this.setRefresh();
          }
        } else {
          console.dir(res.status);
        }
      })
      .catch(err => {
        console.log("FAIL");
        this.haveSession = false;
      });
  },
  mounted() {
    let self = this;
    var isExist = false;

    window.onkeypress = function(e) {
      if (e.key == "Enter") {
        scannedID = scannedArray.join("");
        scannedArray = [];
        console.log(scannedID);
        for (var i in self.bookingList) {
          console.log("inside for loop");
          if (self.bookingList[i].rfid == scannedID) {
            isExist = true;
            var booking_id = self.bookingList[i].booking_id;
            self.bookingList[i].booking_status = "Admitted";
            // socket.emit("admitted", booking_id); //socket
            var day = new Date();
            self.bookingList[i].time_in = moment(day).format("HH:mm");
            self.$axios
              .put(
                `http://${
                  config.serverURL
                }/bookings/updateStatus/${booking_id}`,
                {
                  booking_status: "Admitted"
                }
              )
              .then(res => {
                // console.log(res.data)
              })
              .catch(() => {
                console.log("FAILURE");
              });
          }
        }
        if (isExist == false) {
          //check whether the user have another booking which is not cancelled and after current time
          self.$axios
            .get(`http://${config.serverURL}/bookings/rfid/${scannedID}`)
            .then(res => {
              let data = res.data[0];
              if (res.data.length == 0) {
                //if no booking then display error message
                console.log("toast");
                self.$toast.open({
                  duration: 5000,
                  message: `User does not have any bookings!`,
                  position: "is-bottom",
                  type: "is-danger"
                });
              } else {
                console.log("displayOtherbooking");
                self.$dialog.alert({
                  title: "WRONG BOOKING",
                  message:
                    "User does not have booking here, actual booking is act as " +
                    data.role_name +
                    " at " +
                    data.station_name +
                    " at " +
                    data.session_start,
                  confirmText: "OK"
                });
              }
            })
            .catch(() => {
              console.log("FAILURE");
            });
        }
      } else {
        scannedArray.push(e.key);
      }
    };
  },

  computed: {
    filteredData() {
      if (this.filter !== "") {
        let data = [];
        for (var i in this.bookingList) {
          if (
            this.bookingList[i].queue_no
              .toLowerCase()
              .includes(this.filter.toLowerCase())
          ) {
            data.push(this.bookingList[i]);
          }
        }
        return data;
      }
      return this.bookingList;
    },

    numberOfAdmit() {
      var count = 0;
      for (var i in this.bookingList) {
        if (this.bookingList[i].booking_status === "Admitted") {
          count++;
        } else {
        }
      }
      return count;
    },
    isEmpty() {
      if (this.bookingList.length === 0) return true;
      else return false;
    }
  },
  destroyed() {
    socket.close();
  },
  beforeMount() {
    //set page title
    //this.$store.commit("setPageTitle", "{{StationName}}");
    socket = io.socketio.connect(`http://${config.serverURL}/crew`);
    socket.on("newAdmission", booking_id => {
      this.noOfBookings = data;
    });
  }
};
</script>

<style>
#attendance {
  margin-top: 20px;
  margin-left: 85%;
}

tr.is-success-table {
  background: #c0ffcf;
  color: #000;
}
</style>
