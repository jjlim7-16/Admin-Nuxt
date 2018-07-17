<template>
  <section id="dashboard" class="section">
    <!-- <div>
      <div class="box">
        <h4>No. Of Visitors Today</h4>
        <p>{{ noOfBookings }}</p>
      </div>
      <div class="box">
        <my-line :data='data'></my-line>
      </div>
      <div class="box">
        <bar :data='bardata'></bar>
      </div>
    </div> -->
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
        <my-line class="box" :width="800" :data='byTimeData'></my-line>
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
import Chart from 'chart.js'
import axios from 'axios'
import moment from 'moment'
import DoughnutChart from '@/components/DoughnutChart'
import BarChart from '@/components/bar-chart'
import io from '../../../plugins/socket-io.js'
// import { mapGetters } from 'vuex'

export default {
  components: {
    DoughnutChart,
    BarChart
  },
  data() {
    return {
      noOfBookings: 0,
      avgBookings: 0.0,
      data: [65, 59, 87, 81, 56, 55, 36],
      bardata: [65, 59, 87, 81, 56, 55, 36],
      byStationData: [],
      byTimeData: [5]
    }
  },
  beforeMount() {
    let socket = io.socketio.connect('http://localhost:8000')
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
      // console.log(data)
      this.byTimeData = data
    })
    socket.on('getBookingByStation', (data) => {
      this.byStationData = data
    })
  }
}
</script>

<style scoped>
#dashboard {
  margin: 100px 35px 30px;
}
</style>

