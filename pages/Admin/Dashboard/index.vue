<template>
  <div class="container" style="margin: 20px 35px 0;">
    <div>
      <div class="box">
        <h4>No. Of Visitors Today</h4>
        <p>{{ test }}</p>
      </div>
      <div class="box">
        <bar :data='bardata'></bar>
      </div>
    </div>
    <div class="is-pulled-right" style="margin-left: 30px;">
      <div class="box">
        <my-line :data='data'></my-line>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js'
import axios from 'axios'
import moment from 'moment'
import barchart from '~/components/bar-chart'
import io from '../../../plugins/socket-io.js'
// import { mapGetters } from 'vuex'

let socket = io.socketio.connect('http://localhost:8000')

export default {
  data() {
    return {
      test: 0,
      data: [65, 59, 87, 81, 56, 55, 36],
      bardata: [65, 59, 87, 81, 56, 55, 36]
    }
  },
  beforeCreate() {
    axios.get('http://localhost:8000/dashboard/count')
    .then(results => {
      this.test = results.data
    })
    .catch(err => {
      console.log(err)
    })
  },
  methods: {
    getData() {
      // let socket = io.connect('http://localhost:8000')
      socket.on('pushdata', (data) => {
        this.data.datasets[0].data.shift()
        this.data.datasets[0].data.push(data)
      })
    }
  },
  mounted() {
    socket.on('getBookingCount', (data) => {
      // this.data.datasets[0].data.shift()
      // this.data.datasets[0].data.push(data)
      this.test = data
      // this.data.push(data)
    })
    socket.on('getBookingByDay', (data) => {
      this.bardata = data
    })
  }
}
</script>
