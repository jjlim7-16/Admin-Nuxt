<template>
<section id="content" class="box">
  <b-field grouped>
    <b-field expanded class="column is-5">

      <button class="button is-white" onclick="false">
        <b-icon icon="clock" size="is-medium"></b-icon> &nbsp;
        <span v-if="haveSession"> <b>{{ sessionStartTime }} to {{ sessionEndTime }} </b> </span>
      </button>
    </b-field>

    <b-field expanded class="column is-2">
      <b-input placeholder="Search for a queue number" type="search" icon="magnify" v-model="filter" rounded @focus="isFocus = true" @blur="isFocus = false">
      </b-input>
    </b-field>
  </b-field>

  <b-table :data="isEmpty ? [] : filteredData" :paginated="paginated" :per-page="perPage" :current-page.sync="currentPage" :row-class="(row, index) => getRowClass(row)">

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
  <b-field class="level columns">
    <b-field id="reservation" class="level-left column makeFlex is-half" >
      <div class="level-item">
        <b>No. Of Reservation</b>: {{ noOfReservedSlots }}
      </div>
    </b-field>

    <b-field id="attendance" class="level-right column makeFlex is-half">
      <div class="level-item">
        <b>Present</b>: {{ numberOfAdmit }}/{{ numberOfBooking }}
      </div>
    </b-field>
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
    getRowClass(row) {
      if (row.booking_status === "Admitted") return "is-success-table";
      else if (row.booking_status === "Reserved") return "is-reserved-table";
    },
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
    refreshOnStart() {
      console.log("inside refresh on 9:55");
      var day = new Date();
      var currentTime = new moment(day, "HH:mm");
      console.log(this.sessionEndTime);
      var refreshTime = new moment("09:55:00", "HH:mm");
      console.log(currentTime < refreshTime);
      if (currentTime < refreshTime) {
        console.log(refreshTime);
        var duration = moment.duration(refreshTime.diff(currentTime));
        var miliseconds = duration.as("milliseconds");
        console.log(miliseconds);
        setTimeout(() => {
          this.$router.go();
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
      noOfReservedSlots: 0,
      isExist: false,
      isFocus: false,
      bookingList: [],
      bookingListWithReserved: [],
      sessionStartTime: "",
      sessionEndTime: "",
      stationName: "",
      stationID: 0,
      numberOfBooking: 0,
      errMessage: "",
      filter: "",
      currentPage: 1,
      paginated: true,
      perPage: 10,
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
        `http://${config.serverURL}/reservations/getCurrentReservation/${
          this.stationID
        }`
      )
      .then(res => {
        if (res.status === 200) {
          console.log("reservationData", res.data);
          if (res.data.length > 0) {
            this.noOfReservedSlots = 0; //reset the noOfReservedSlots to 0
            theData = res.data;
            for (var i in theData) {
              let noOfReserved = parseInt(theData[i].noOfReservedSlots);
              this.noOfReservedSlots += noOfReserved;
              console.log("Number of reserved for a role", noOfReserved);
              let roleName = theData[i].role_name;
              var aReservation = {
                booking_id: "0000",
                session_id: "0000",
                station_name: theData[i].station_name,
                session_date: theData[i].session_date,
                role_name: theData[i].role_name,
                session_start: theData[i].session_start,
                session_end: theData[i].session_end,
                booking_status: "Reserved",
                rfid: "0000",
                queue_no: "-"
              };
              console.log("areservation", aReservation);
              for (var u = 0; u < noOfReserved; u++) {
                this.bookingListWithReserved.push(aReservation);
                console.log("looping to push reserved", u);
              }
            }
            console.log(this.noOfReservedSlots);
            console.log(
              "bookingListwithReserved",
              this.bookingListWithReserved
            );
          } else {
            this.noOfReservedSlots = 0;
          }
        } else {
        }
      })
      .catch(err => {
        console.log("FAIL getting reservations");
        console.log(err);
      });
    this.$axios
      .get(
        `http://${config.serverURL}/bookings/getbookinglist/${this.stationID}`
      )
      .then(res => {
        if (res.status === 200) {
          console.log("bookinglist", res.data);
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
                    this.refreshOnStart();
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
            for (var u in theData) {
              this.bookingListWithReserved.push(theData[u]);
            }
            console.log(this.bookingListWithReserved);
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
          scannedID = scannedID.toUpperCase();
          scannedArray = [];
          console.log(scannedID);
          self.isExist = false;
          for (var i in self.bookingList) {
            console.log("inside for loop");
            console.log(self.bookingList[i].rfid);
            if (self.bookingList[i].rfid == scannedID) {
              self.isExist = true;
              if (self.bookingList[i].booking_status == "Admitted") {
                self.$toast.open({
                  duration: 1500,
                  message: `User already admitted !`,
                  position: "is-bottom",
                  type: "is-success"
                });
              } else {
                var booking_id = self.bookingList[i].booking_id;
                self.bookingList[i].booking_status = "Admitted";
                var day = new Date();
                var time_in = moment(day).format("HH:mm");
                for (var u in self.bookingListWithReserved) {
                  if (self.bookingListWithReserved[u].rfid == scannedID) {
                    self.bookingListWithReserved[u].booking_status = "Admitted";
                    self.bookingListWithReserved[u].time_in = time_in;
                  }
                }
                self.bookingList[i].time_in = time_in;
                socket.emit("admitted", self.bookingListWithReserved); //socket
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
                    console.log("sucessupdatestatus", res.data);
                  })
                  .catch(() => {
                    console.log("FAILURE");
                  });
              }
            }
          }
          console.log(self.isExist);
          if (self.isExist == false) {
            console.log("customer not exist");
            //check whether the user have another booking which is not cancelled and after current time
            self.$axios
              .get(`http://${config.serverURL}/bookings/rfid/${scannedID}`)
              .then(res => {
                let data = res.data;
                console.log(data);
                let haveConfirmBooking = false;
                if (res.data.length > 0) {
                  for (var i of data) {
                    console.log(i.booking_status);
                    if (i.booking_status === "Confirmed") {
                      haveConfirmBooking = true;
                      console.log("displayOtherbooking");
                      self.$dialog.alert({
                        title: "Wrong Booking",
                        message:
                          "User does not have a booking here.<br/><br/>" +
                          "<b>Actual booking:</b><br/>" +
                          i.station_name +
                          "<br/>" +
                          i.role_name +
                          "<br/>" +
                          i.session_start +
                          " to " +
                          i.session_end +
                          "<br/>" +
                          i.queue_no +
                          "",
                        confirmText: "OK"
                      });
                    }
                  }
                  if (haveConfirmBooking == false) {
                    console.log("toast");
                    self.$toast.open({
                      duration: 1500,
                      message: `User does not have any bookings!`,
                      position: "is-bottom",
                      type: "is-danger"
                    });
                  }
                } else {
                  //if no booking then display error message
                  console.log("toast");
                  self.$toast.open({
                    duration: 1500,
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
      console.log("inside filtered data", this.bookingListWithReserved);
      if (this.filter !== "") {
        let data = [];
        console.log("inside filtered data", this.bookingListWithReserved);
        for (var i in this.bookingListWithReserved) {
          if (
            this.bookingListWithReserved[i].queue_no
              .toLowerCase()
              .includes(this.filter.toLowerCase())
          ) {
            data.push(this.bookingListWithReserved[i]);
          }
        }
        return data;
      }
      return this.bookingListWithReserved;
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
      if (this.bookingListWithReserved.length === 0) return true;
      else return false;
    }
  },
  destroyed() {
    socket.close();
  },
  beforeMount() {
    socket = io.socketio.connect(`http://${config.serverURL}/crew`);
    socket.on("newAdmission", bookingListWithReserved => {
      this.bookingListWithReserved = bookingListWithReserved;
    });
  }
};
</script>

<style>
#attendance {
  margin-top: 0;
}

#reservation {
  margin-bottom: 0;
}

.makeFlex {
  display: flex;
}

tr.is-success-table {
  background: #c0ffcf;
  color: #000;
}
tr.is-reserved-table {
  background: #d6f0ff;
  color: #000;
}
</style>
