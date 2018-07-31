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
      :data = "filteredData"
      :row-class="(row, index) => row.booking_status === 'Admitted' && 'is-success'">

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
import axios from "axios";
import moment from "moment";
import config from "~/config";
import io from "~/plugins/socket-io.js";
let socket;

function WebFormData(booking_status) {
  this.booking_status = booking_status;
}

export default {
  layout: "crewMenu",
  methods: {
    setRefresh() {
      var day = new Date();
      var currentTime = moment(day, "HH:mm:ss");
      //this.sessionStartTime = "15:19:00";
      var refreshTime = moment(this.sessionStartTime, "HH:mm:ss").add(
        5,
        "minutes"
      );
      console.log(currentTime);
      //console.log(currentTime.add(11, 'minutes').format('hh:mm A'));
      //console.log("currenttime",currentTime.duration.get('minutes'));

      console.log(
        new moment(this.sessionStartTime, "HH:mm")
          .add(11, "minutes")
          .format("hh:mm A")
      );
      //  setTimeout(function(){ alert("You"); }, 3000);
      console.log(
        currentTime.isAfter(
          new moment(this.sessionStartTime, "HH:mm:ss")
            .add(5, "minutes")
            .format("hh:mm A")
        )
      );
      if (currentTime.isAfter(refreshTime)) {
        console.log("current time is after nearest session start + 5mins");
        //   console.log(currentTime.diff(currentTime));

        this.$router.go();
      } else {
        console.log("current time is before nearest session start + 5mins");
        var duration = moment.duration(refreshTime.diff(currentTime));

        var miliseconds = duration.as("milliseconds");
        console.log(miliseconds);

        setTimeout(() => {
          this.$router.go();
        }, miliseconds);
      }
    }
  },
  data() {
    return {
      bookingList: [],
      sessionStartTime: "",
      sessionEndTime: "",
      stationName: "",
      stationID: "",
      numberOfBooking: 0,
      filter: "",
      userBookingRoleName: "",
      userBookingStationName: "",
      userBookingIsBooked: false,
      userBookingSessionStartTime: "",
      userBookingSessionEndTime: ""
    };
  },
  created() {
    let theData;
    let startTime;
    let endTime;

    this.$axios
      .get(`http://${config.serverURL}/bookings/getbookinglist/1`)
      .then(res => {
        if (res.status === 200) {
          console.log(res.data);
          console.log(res.data[0]);
          theData = res.data;
          this.bookingList = theData;

          this.sessionStartTime = theData[0].session_start;
          this.sessionEndTime = theData[0].session_end;
          this.stationName = theData[0].station_name;
          this.numberOfBooking = theData.length;
          this.setRefresh();
        } else {
          console.dir(res.status);
        }
      })
      .catch(err => {
        console.log("FAIL");
      });
  },
  mounted() {
    let self = this;
    var isExist = false;
    let scannedID = "";
    let scannedArray = [];

    window.onkeypress = function(e) {
      if (e.key == "Enter") {
        scannedID = scannedArray.join("");
        console.log(scannedID);
        for (var i in this.bookingList) {
          console.log("inside for loop");
          if ((this.bookingList[i].rfid = scannedID)) {
            isExist = true;
            var booking_id = his.bookingList[i].booking_id;
            this.bookingList[i].booking_status = "Admitted";
            this.socket.emit("admitted", booking_id); //socket
            var day = new Date();
            this.bookingList[i].time_in = moment(day).format("HH:mm");
            let webFormData = new WebFormData(
              this.bookingList[i].booking_status
            );

            let formData = new FormData();
            //console.log(formData)
            formData.append(webFormData.name);
            formData.append("webFormData", JSON.stringify(webFormData));
            console.log(webFormData);
            this.$axios
              .put(
                `http://${config.serverURL}/bookings/updateStatus/` +
                  booking_id,
                formData
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
      if (isExist == false) {
        let booking;
        this.$axios
          .get(`http://${config.serverURL}/bookings/` + scannedID)
          .then(res => {
            if (res.status === 200) {
              console.log(res.data);
              if (res.data != null) {
                booking = res.data[0];
                this.userBookingRoleName = booking.role_name;
                this.userBookingStationName = booking.station_name;
                this.userBookingSessionStartTime = booking.session_start;
                this.userBookingSsessionEndTime = booking.session_end;
                this.$dialog.alert({
                  title: "Wrong Booking",
                  message:
                    "You have a booking as " +
                    this.userBookingRoleName +
                    " at " +
                    this.userBookingStationName +
                    " from " +
                    this.userBookingRSessionStartTime +
                    " to " +
                    this.userBookingSessionEndTime,
                  type: "is-danger",
                  hasIcon: true,
                  icon: "times-circle",
                  iconPack: "fa"
                });
              } else {
                this.$toast.open({
                  duration: 5000,
                  message: "User does not have any bookings!",
                  position: "is-bottom",
                  type: "is-danger"
                });
              }
            } else {
              console.dir(res.status);
            }
          })
          .catch(err => {
            console.log("Fail");
            booking = null;
          });
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

    numberOfConfirm() {
      var count = 0;
      for (var i in this.bookingList) {
        if (this.bookingList[i].booking_status === "Admitted") {
          count++;
        } else {
        }
      }
      return count;
    }
  },
  destroyed() {
    socket.close();
  },
  beforeMount() {
    socket = io.socketio.connect(`http://${config.serverURL}/crew`);
    socket.on("newAdmission", booking_id => {
      this.noOfBookings = data;
    });
  }
};
</script>

<style scoped>
#content {
  margin: 25px;
}

#attendance {
  margin-top: 20px;
  margin-left: 720px;
}

tr.is-success {
  background: #c0ffcf;
  color: #000;
}
</style>
