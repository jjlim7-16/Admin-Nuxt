<template>
  <!-- <canvas id="myChart" width="400" height="400"></canvas> -->
	<div class="bar-chart">
    <bar-chart :data="barChartData" :options="{ maintainAspectRatio: false }"/>
  </div>
</template>

<script>
import Chart from 'chart.js'
import BarChart from '~/components/bar-chart'
import axios from 'axios'
import moment from 'moment'

export default {
  data() {
    // const res = await axios.get(`https://api.github.com/repos/nuxt/nuxt.js/stats/commit_activity?access_token=${env.githubToken}`)
    return {
      barChartData: {
        // labels: res.data.map((stat) => moment(stat.week * 1000).format('GGGG[-W]WW')),
        // datasets: [
        //   {
        //     label: 'Nuxt.js Commit Activity',
        //     backgroundColor: '#41b883',
        //     data: res.data.map((stat) => stat.total)
        //   }
        // ]
        data: {
          labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
          datasets: [
            {
              label: "Population (millions)",
              backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
              data: [2478,5267,734,784,433]
            }
          ]
        },
        options: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Predicted world population (millions) in 2050'
          }
        }
      }
    }
  },
  components: {
    BarChart
  }
}
// var ctx = document.getElementById("myChart");
// var myChart = new Chart(ctx, {
// 	type: 'bar',
// 	data: {
// 		labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
// 		datasets: [{
// 			label: '# of Votes',
// 			data: [12, 19, 3, 5, 2, 3],
// 			backgroundColor: [
// 				'rgba(255, 99, 132, 0.2)',
// 				'rgba(54, 162, 235, 0.2)',
// 				'rgba(255, 206, 86, 0.2)',
// 				'rgba(75, 192, 192, 0.2)',
// 				'rgba(153, 102, 255, 0.2)',
// 				'rgba(255, 159, 64, 0.2)'
// 			],
// 			borderColor: [
// 				'rgba(255,99,132,1)',
// 				'rgba(54, 162, 235, 1)',
// 				'rgba(255, 206, 86, 1)',
// 				'rgba(75, 192, 192, 1)',
// 				'rgba(153, 102, 255, 1)',
// 				'rgba(255, 159, 64, 1)'
// 			],
// 			borderWidth: 1
// 		}]
// 	},
// 	options: {
// 		scales: {
// 			yAxes: [{
// 				ticks: {
// 					beginAtZero:true
// 				}
// 			}]
// 		}
// 	}
// })
</script>
