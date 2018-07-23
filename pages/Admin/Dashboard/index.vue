<template>
  <section id="dashboard" class="section">
    <div>
      <div class="level">
        <div class="level-item has-text-centered">
          <div class="box" style="width: 400px; margin-right: 35px;">
            <p class="heading">No. Of Bookings Today</p>
            <p class="title">{{ noOfBookings }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div class="box" style="width: 400px;">
            <p class="heading">Avg. Bookings Per Visitor</p>
            <p class="title">{{ avgBookings }}</p>
          </div>
        </div>
      </div>
      <div class="level">
        <div class="box">
          <b-field>
            <b-select v-model="stationId">
              <option v-for="station in stationList" :value="station.station_id" :key="station.station_name">
                {{station.station_name}}
              </option>
            </b-select>
          </b-field>
          <my-line class="box" :width="800" :data='filterTimeData'></my-line>
        </div>
        
        <!-- <realtime :data="byTimeData"></realtime> -->
      </div>
      <div class="level">
        <div class="level-left">
          <bar class="box level-item" style="width: 400px;" :data='bardata'></bar>
        </div>
        <div class="level-right">
          <doughnut class="box level-item" style="width: 400px;" :data='byStationData'></doughnut>
        </div>
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
import axios from 'axios'
import moment from 'moment'
import io from '../../../plugins/socket-io.js'
import config from '~/config.js'
// import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      noOfBookings: 0,
      avgBookings: 0.0,
      data: [65, 59, 87, 81, 56, 55, 36],
      bardata: [65, 59, 87, 81, 56, 55, 36],
      byStationData: [],
      byTimeData: {},
      stationList: null,
      stationId: null
    }
  },
  async beforeCreate() {
    await axios.get(`http://${config.serverURL}/roles/`)
		.then((res) => {
      this.stationList = res.data[1]
      this.stationId = this.stationList[0].station_id
      // console.log(this.stationList.find(i => i.station_id === this.stationId).station_name)
		})
  },
  beforeMount() {
    let socket = io.socketio.connect(`http://${config.serverURL}/dashboard`)
    socket.on('getBookingCount', (data) => {
      this.noOfBookings = data
    })
    socket.on('getAvgBookings', (data) => {
      this.avgBookings = data
    })
    socket.on('getBookingByDay', (data) => {
      this.bardata = data
    })
    socket.on('getBookingByTime', (data) => {
      this.byTimeData = data
    })
    socket.on('getBookingByStation', (data) => {
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
      // data[station] = []
      // data[station] = this.byTimeData[station]
      data['station'] = station
      data['results'] = this.byTimeData[station]
      console.log(data)
      return data
    }
  }
}
</script>

<style scoped>
#dashboard {
  margin: 100px 35px 30px;
}
</style>
