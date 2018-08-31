<template>
<section id="content" class="box">
  <div class="columns is-12 is-multiline myContainer is-centered">
    <div class="column is-half has-text-centered">
      <div class="box fullWidth">
        <p class="heading">No. Of Bookings Today</p>
        <p class="title">{{ noOfBookings }}</p>
      </div>
    </div>
    <div class="column is-half has-text-centered">
      <div class="box fullWidth">
        <p class="heading">Avg. Bookings Per User Today</p>
        <p class="title">{{ avgBookings }}</p>
      </div>
    </div>
    <div class="column is-12 fullWidth">
      <div class="box container fullWidth">
        <b-field>
          <b-select v-model="stationId">
            <option v-for="station in stationList" :value="station.station_id" :key="station.station_name">
              {{station.station_name}}
            </option>
          </b-select>
        </b-field>
        <my-line :data='filterTimeData'></my-line>
      </div>
    </div>
    <div class="column is-half has-text-centered">
      <bar class="box fullWidth" :data='bardata'></bar>
    </div>
    <div class="column is-half has-text-centered">
      <doughnut class="box fullWidth" :data='byStationData'></doughnut>
      <!-- <p v-if="zeroBookings">No Bookings Has Been Made Today</p> -->
    </div>
  </div>
</section>
</template>

<script>

import moment from 'moment'
import io from '~/plugins/socket-io.js'
import config from '~/config.js'

let socket

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
  async mounted() {
    this.$store.commit("setPageTitle", "Dashboard");
    let res = await this.$axios.get(`http://${config.serverURL}/roles/`);
    this.stationList = res.data[1];
    this.stationList = this.stationList.filter(i => i.is_active === 1);
    this.stationId = this.stationList[0].station_id;

    socket = io.socketio.connect(`http://${config.serverURL}/dashboard`);
    socket.on("getBookingCount", data => {
      this.noOfBookings = data
    })
    socket.on("getAvgBookings", data => {
      this.avgBookings = data
    })
    socket.on("getBookingByDay", data => {
      this.bardata = data
    })
    socket.on("getBookingByTime", data => {
      console.log(data)
      this.byTimeData = data
    })
    socket.on("getBookingByStation", data => {
      this.byStationData = data
    })
  },
  computed: {
    filterTimeData() {
      // let station = this.stationList.find(i => i.station_id === this.stationId).station_name
      // return this.byStationData[station]
      let data = {}
      // let station = this.stationList.find(i => i.station_id === this.stationId).station_name
      // console.log(station)
      let station = ''
      for (var i in this.stationList) {
        if (this.stationList[i].station_id === this.stationId) {
          station = this.stationList[i].station_name
          break
        }
      }
      data['station'] = station
      data['results'] = this.byTimeData[station]
      return data
    },
    zeroBookings() {
      let count = 0
      for (let i in this.byStationData.data) {
        count += this.byStationData.data[i]
      }
      if (count <= 0) return true
    }
  },
  destroyed() {
    if (socket) {
      socket.close()
    }
  }
};
</script>

<style scoped>
.heading {
  font-size: 0.8em;
}

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

@media only screenand (min-width:320px) and (max-width:767px) and (orientation:portrait) {
  #content {
    position: relative;
  }
}

@media screen and (min-width:320px) and (max-width:767px) and (orientation:landscape) {
  #content {
    position: relative;
    overflow-y: scroll;
  }
}

</style>
