<template>
  <section id="content"  class="box columns is-multiline">
    <b-field grouped>
      <b-field expanded class="column is-5" >
      
      <button class="button is-white" onclick="false">
        <b-icon icon="clock" size="is-medium"></b-icon> &nbsp;
        <span v-if="haveSession"> <b>{{ sessionStartTime }} to {{ sessionEndTime }} </b> </span>    
      </button>
      </b-field>


      <b-field expanded class="column is-10"  >
      <b-input placeholder="Search for a queue number"
               type="search"
               icon="magnify"
               v-model="filter"
               rounded
               @focus="isFocus = true"
               @blur="isFocus = false">
      </b-input>
      </b-field>
    </b-field>


    <b-table
      :data="isEmpty ? [] : filteredData"
    	:paginated="paginated"
			:per-page="perPage"
			:current-page.sync="currentPage"
      :row-class="(row, index) => row.booking_status === 'Admitted' && 'is-success-table'" class="column is-10">

      <template slot-scope="props">
        <b-table-column field="queue_no" label="Queue No." filterable width="150" sortable>
          {{ props.row.queue_no }}
        </b-table-column>

        <b-table-column field="role_name" label="Role Name" centered  sortable>
          {{ props.row.role_name }}
        </b-table-column>

        <b-table-column field="time_in" label="Time in" centered  sortable>
          <span v-if="props.row.time_in">{{ props.row.time_in.substr(props.row.time_in,5) }}</span>
          <span v-else>-</span>
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
        var currentTime = new moment(day, "HH:mm");
        //var currentTime = new moment("14:54", "HH:mm");
        console.log(this.sessionEndTime);
        var refreshTime = new moment(this.sessionEndTime, "HH:mm").subtract(
          5,
          "minutes"
        );

        console.log(refreshTime);
        var duration = moment.duration(refreshTime.diff(currentTime));

        var miliseconds = duration.as("milliseconds");
        console.log(miliseconds);

        setTimeout(() => {
          this.updateNotAdmittedBookingsAndRefresh();
        }, miliseconds);
      }
    },
    updateNotAdmittedBookingsAndRefresh() {
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
      this.$router.go();
    }
  },
  data() {
    return {
      isExist: false,
      isFocus: false,
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
    };
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
                `http://${config.serverURL}/sessions/currentSession/${
                  this.stationID
                }`
              )
              .then(res => {
                if (res.status === 200) {
                  if (res.data.length > 0) {
                    console.log(res.data);
                    this.stationName = res.data[0].station_name;
                    this.$store.commit("setPageTitle", this.stationName);
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
                    this.setRefresh();
                  } else {
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

            this.numberOfBooking = theData.length;
            this.setRefresh();
            this.stationName = theData[0].station_name;
            this.$store.commit("setPageTitle", this.stationName);
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

    window.onkeypress = function(e) {
      console.log(self.isFocus);
      if (self.isFocus == false) {
        if (e.key == "Enter") {
          scannedID = scannedArray.join("");
          scannedArray = [];
          console.log(scannedID);
          for (var i in self.bookingList) {
            self.isExist = false;
            console.log("inside for loop");
            console.log(self.bookingList[i].rfid);
            if (self.bookingList[i].rfid == scannedID) {
              self.isExist = true;
              var booking_id = self.bookingList[i].booking_id;
              self.bookingList[i].booking_status = "Admitted";

              var day = new Date();
              var time_in = moment(day).format("HH:mm");
              self.bookingList[i].time_in = time_in;
              socket.emit("admitted", self.bookingList); //socket
              self.$axios
                .put(
                  `http://${
                    config.serverURL
                  }/bookings/updateStatus/${booking_id}`,
                  {
                    booking_status: "Admitted",
                    time_in: moment(day).format("HH:mm")
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
          console.log(self.isExist);
          if (self.isExist == false) {
            console.log("customer not exist");
            //check whether the user have another booking which is not cancelled and after current time
            self.$axios
              .get(`http://${config.serverURL}/bookings/rfid/${scannedID}`)
              .then(res => {
                let data = res.data[0];
                console.log(data);
                if (res.data.length > 0) {
                  console.log("displayOtherbooking");
                  self.$dialog.alert({
                    title: "Wrong Booking",
                    message:
                      "User does not have booking here!" +
                      "Actual booking: " +
                      data.station_name +
                      " , " +
                      data.role_name +
                      " @ " +
                      data.session_start +
                      ".",
                    confirmText: "OK"
                  });
                } else {
                  //if no booking then display error message
                  console.log("toast");
                  self.$toast.open({
                    duration: 5000,
                    message: `User does not have any bookings!`,
                    position: "is-bottom",
                    type: "is-danger"
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
    socket = io.socketio.connect(`http://${config.serverURL}/crew`);
    socket.on("newAdmission", bookingList => {
      this.bookingList = bookingList;
      // for (var i in this.bookingList) {
      //   if (this.bookingList[i].booking_id == booking_id) {
      //     this.bookingList[i].booking_status = "Admitted";
      //     //this.bookingList[i].time_in = data.time_in;

      //     console.log(this.bookingList[i]);
      //   }
      // }
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
