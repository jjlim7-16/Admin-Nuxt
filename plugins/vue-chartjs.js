import Vue from 'vue'
import { Line, Bar, Doughnut } from 'vue-chartjs'
import moment from 'moment'
// import 'chartjs-plugin-streaming'
// import axios from 'axios'
// import io from './socket-io'
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
					// labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
					labels: this.timeData,
					datasets: [
						{
							label: this.chartData[0].station_name,
							fill: false,
							// backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850', '#ea344f', '#f4ac32'],
							borderColor: '#3cba9f',
							borderWidth: 2,
							radius: 2,
							backgroundColor: '#3cba9f',
							data: this.chartData
						}
						// {
						// 	label: 'Test2',
						// 	fill: false,
						// 	// backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850', '#ea344f', '#f4ac32'],
						// 	borderColor: this.color,
						// 	backgroundColor: this.color,
						// 	data: [{
						// 		x: moment('10:00', 'HH:mm a'),
						// 		y: 60
						// 	}, {
						// 		x: moment('10:30', 'HH:mm a'),
						// 		y: 30
						// 	}]
						// }
					]
				},
				{
					title: {
						display: true,
						text: 'No. Of Bookings By Date',
						fontSize: 14,
						padding: 5,
						lineHeight: 2
					},
					tooltips: {
						callbacks: {
							label: function (tooltipItem, data) {
								var label = data.datasets[tooltipItem.datasetIndex].label || ''
								if (label) {
									label += ': '
								}
								label += tooltipItem.yLabel + '%'
								return label
							}
						}
					},
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero: true,
								min: 0,
								max: 100,
								stepSize: 10
							}
						}],
						xAxes: [{
							type: 'time',
							time: {
								parser: 'HH:mm a',
								unit: 'minute',
								displayFormats: {
									'minute': 'h:mm a'
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
		},
		timeData: function () {
			let time = moment('10:00', 'HH:mm')
			let arr = []
			while (time <= moment('18:00', 'HH:mm')) {
				arr.push(time.format('HH:mm a'))
				time = time.add(30, 'minutes')
			}
			console.log(arr)
			return arr
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

Vue.component('line-chart', {
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
					labels: this.timeData,
					datasets: [
						{
							fill: false,
							borderColor: '#3e95cd',
							backgroundColor: '#3e95cd',
							data: this.chartData
						}
					]
				},
				{
					title: {
						display: true,
						text: 'No. Of Bookings By Time',
						fontSize: 14,
						padding: 5,
						lineHeight: 2
					},
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero: true,
								min: 0,
								max: 100,
								stepSize: 20
							}
						}],
						xAxes: [{
							type: 'time',
							time: {
								parser: 'HH:mm a',
								unit: 'minute',
								displayFormats: {
									'minute': 'h:mm a'
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
		},
		timeData: function () {
			let time = moment('10:00', 'HH:mm')
			let arr = []
			while (time <= moment('18:00', 'HH:mm')) {
				arr.push(time.format('HH:mm a'))
				time = time.add(30, 'minutes')
			}
			console.log(arr)
			return arr
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

Vue.component('realtime', {
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
					datasets: [
						{
							data: []
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
							type: 'realtime'
						}]
					},
					plugins: {
						streaming: {
							duration: 20000,
							refresh: 1000,
							delay: 1000,
							frameRate: 30,
							pause: false,
							onRefresh: function (chart) {
								// socket.on('getBookingByTime', data => {
								// 	chart.data.datasets[0].data.push({
								// 		x: Date.now(),
								// 		y: data
								// 	})
								// })
								chart.data.datasets[0].data.push({
									x: Date.now(),
									y: this.chartData
								})
							}
						}
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
						text: 'No. of Bookings By Day',
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

Vue.component('doughnut', {
	extends: Doughnut,
	props: ['data', 'options'],
	mounted () {
		// this.renderChart(this.data, this.options)
		this.renderDoughnutChart()
	},
	methods: {
		renderDoughnutChart: function () {
			this.renderChart(
				{
					// labels: this.chartData.stations,
					datasets: [
						{
							backgroundColor: ['#5879a4', '#3cba9f', '#e8c3b9', '#c45850', '#ea344f', '#f4ac32'],
							data: this.chartData.data
						}
					],
					labels: ['KFC', 'Pizza']
				},
				{
					title: {
						display: true,
						text: 'Booking Pct. By Stations',
						fontSize: 14,
						padding: 5,
						lineHeight: 2
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
			this.renderDoughnutChart()
		}
	}
})
