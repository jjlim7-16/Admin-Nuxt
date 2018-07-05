import Vue from 'vue'
import { Line, Bar } from 'vue-chartjs'
// import 'chartjs-plugin-streaming'
// const { reactiveProp } = mixins

Vue.component('my-line', {
	extends: Line,
	// mixins: [reactiveProp],
	props: ['data', 'options'],
	mounted () {
		this.renderLineChart()
	},
	methods: {
		renderLineChart: function () {
			this.renderChart(
				{
					labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
					datasets: [
						{
							backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850', '#ea344f', '#f4ac32'],
							data: this.chartData
						}
					]
				},
				{
					legend: {
						display: false
					},
					title: {
						display: true,
						text: 'No. Of Bookings By Date',
						fontSize: 14,
						padding: 5,
						lineHeight: 2
					},
					scales: {
						xAxes: [{
							type: 'time',
							time: {
								unit: 'week',
								displayFormats: {
									week: 'll'
								}
							}
						}]
					},
					responsive: true,
					maintainAspectRatio: false
				}
			)
		}
	},
	computed: {
		chartData: function () {
			return this.data
		}
	},
	watch: {
		data: function () {
			if (this._chart) {
				this._chart.destroy()
			}
			// this.renderChart(this.data, this.options)
			this.renderLineChart()
		}
	}
})

Vue.component('bar', {
	extends: Bar,
	props: ['data', 'options'],
	mounted () {
		// this.renderChart(this.data, this.options)
		this.renderBarChart()
	},
	methods: {
		renderBarChart: function () {
			this.renderChart(
				{
					labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
					datasets: [
						{
							label: 'Popularity (Weekday)',
							backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850', '#ea344f', '#f4ac32'],
							data: this.chartData
						}
					]
				},
				{
					legend: {
						display: false
					},
					title: {
						display: true,
						text: 'Popularity By Day',
						fontSize: 14,
						padding: 5,
						lineHeight: 2
					},
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero: true
							}
						}]
					},
					responsive: true,
					maintainAspectRatio: false
				}
			)
		}
	},
	computed: {
		chartData: function () {
			return this.data
		}
	},
	watch: {
		data: function () {
			if (this._chart) {
				this._chart.destroy()
			}
			// this.renderChart(this.data, this.options)
			this.renderBarChart()
		}
	}
})
