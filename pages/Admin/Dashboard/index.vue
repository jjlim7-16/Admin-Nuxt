<template>
<section id="content" class="box">
  <div class="columns is-multiline myContainer is-centered">
    <div class="column is-half has-text-centered">
      <div class="box fullWidth">
        <p class="heading">No. Of Bookings Today</p>
        <p class="title">{{ noOfBookings }}</p>
      </div>
    </div>
    <div class="column is-half has-text-centered">
      <div class="box fullWidth">
        <p class="heading">Avg. Bookings Per Visitor</p>
        <p class="title">{{ avgBookings }}</p>
      </div>
    </div>
    <div class="column fullWidth">
      <div class="box container fullWidth">
        <b-field>
          <b-select v-model="stationId">
            <option v-for="station in stationList" :value="station.station_id" :key="station.station_name">
              {{station.station_name}}
            </option>
          </b-select>
        </b-field>
        <my-line :width="850" :data='filterTimeData'></my-line>
      </div>

      <!-- <realtime :data="byTimeData"></realtime> -->
    </div>
    <div class="column is-half has-text-centered">
      <bar class="box fullWidth" :data='bardata'></bar>
    </div>
    <div class="column is-half has-text-centered">
      <doughnut class="box fullWidth" :data='byStationData'></doughnut>
    </div>
  </div>

  <!-- <div class="is-pulled-right" style="margin-left: 30px;">
      <div class="box">
        <doughnut :data='byStationData'></doughnut>
      </div>
      <div class="box">
        <realtime :data="byTimeData"></realtime>
      </div>
    </div> -->
</section>
</template>

<script>
<<<<<<< HEAD
import axios from "axios";
import moment from "moment";
import io from "~/plugins/socket-io.js";
import config from "~/config.js";
=======
import axios from 'axios'
import moment from 'moment'
import io from '~/plugins/socket-io.js'
import config from '~/config.js'
>>>>>>> 2d19697805d24e13e0c0b65a02f5b1d5fdd3f028
// import { mapGetters } from 'vuex'

let socket;

export default {
  data() {
    return {
      noOfBookings: 0,
      avgBookings: 0.0,
      data: [65, 59, 87, 81, 56, 55, 36],
      bardata: [65, 59, 87, 81, 56, 55, 36],
      byStationData: [],
      byTimeData: {},
      stationList: {},
      stationId: null
    };
  },
  async beforeMount() {
    this.$store.commit("setPageTitle", "Dashboard");
    let res = await this.$axios.get(`http://${config.serverURL}/roles/`);
    this.stationList = res.data[1];
    this.stationId = this.stationList[0].station_id;

    socket = io.socketio.connect(`http://${config.serverURL}/dashboard`);
    socket.on("getBookingCount", data => {
      this.noOfBookings = data;
    });
    socket.on("getAvgBookings", data => {
      this.avgBookings = data;
    });
    socket.on("getBookingByDay", data => {
      this.bardata = data;
    });
    socket.on("getBookingByTime", data => {
      this.byTimeData = data;
    });
    socket.on("getBookingByStation", data => {
      this.byStationData = data;
    });
  },
  computed: {
    filterTimeData() {
      // let station = this.stationList.find(i => i.station_id === this.stationId).station_name
      // return this.byStationData[station]
      let data = {};
      // let station = this.stationList.find(i => i.station_id === this.stationId).station_name
      // console.log(station)
      let station = "";
      for (var i in this.stationList) {
        if (this.stationList[i].station_id === this.stationId) {
          station = this.stationList[i].station_name;
          break;
        }
      }
      // data[station] = []
      // data[station] = this.byTimeData[station]
      data["station"] = station;
      data["results"] = this.byTimeData[station];
      return data;
    }
  },
  destroyed() {
    socket.close();
  }
};
</script>

<style scoped>
/* #content {
  margin: 100px 35px 30px;
} */
.fullWidth {
  width: 100%;
  max-width: 100%;
}

#content {
  position: absolute;
}

.column {
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.myContainer {
  margin: auto;
}

@media only screen and (max-width: 767px) {
  #content {
    position: relative;
  }
}

</style>
