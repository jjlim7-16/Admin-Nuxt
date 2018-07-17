import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
	extends: Line,
	mixins: [reactiveProp],
	props: ['options'],
	mounted () {
		this.renderChart(this.chartData, this.options)
		// this.renderDoughnutChart()
	}
	// methods: {
	// 	renderDoughnutChart: function () {
	// 		this.renderChart(
	// 			{
	// 				// labels: this.chartData.stations,
	// 				labels: ['KFC', 'Pizza'],
	// 				datasets: [
	// 					{
	// 						backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850', '#ea344f', '#f4ac32'],
	// 						data: this.chartData.data
	// 					}
	// 				]
	// 				// labels: ['KFC', 'Pizza']
	// 			},
	// 			{
	// 				legend: {
	// 					display: true
	// 				},
	// 				title: {
	// 					display: true,
	// 					text: 'Booking Pct. By Stations',
	// 					fontSize: 14,
	// 					padding: 5,
	// 					lineHeight: 2
	// 				},
	// 				responsive: true,
	// 				maintainAspectRatio: false
	// 			}
	// 		)
	// 	}
	// },
	// computed: {
	// 	chartData: function () {
	// 		return this.data
	// 	}
	// },
	// watch: {
	// 	data: function () {
	// 		if (this._chart) {
	// 			this._chart.destroy()
	// 		}
	// 		// this.renderChart(this.data, this.options)
	// 		this.renderDoughnutChart()
	// 	}
	// }
}
