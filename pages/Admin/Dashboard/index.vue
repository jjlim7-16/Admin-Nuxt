<template>
  <div>
    <div class="box">
      <h4>No. Of Visitors Today</h4>
    </div>
    <div class="box">
      <bar :data='data' :options='options'></bar>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js'
import BarChart from '~/components/bar-chart'
import axios from 'axios'
import moment from 'moment'

export default {
  asyncData() {
    const data = {
      labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
      datasets: [
        {
          label: "Population (millions)",
          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
          data: [2478,5267,734,784,433]
        }
      ]
    }
    const options = {
      title: {
        display: true,
        text: 'Predicted world population (millions) in 2050'
      }
    }
    return { data, options }
  },
  beforeCreate() {

  }
}
</script>
