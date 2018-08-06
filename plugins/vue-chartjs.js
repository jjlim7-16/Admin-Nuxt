import Vue from 'vue'
import { Line, Bar, Doughnut } from 'vue-chartjs'
import moment from 'moment'
import 'chart.piecelabel.js'

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
					labels: this.timeData,
					datasets: [
						{
							label: this.chartData.station,
							borderColor: 'rgba(255,99,132,1)',
							borderWidth: 2,
							radius: 2,
							backgroundColor: 'rgba(255, 99, 132, 0.2)',
							data: this.chartData.results
						}
					]
				},
				{
					title: {
						display: true,
						text: 'Capacity Percentage By Session Time',
						fontSize: 18,
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
					legend: {
						onClick: function (event, legendItem) {}
					},
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero: true,
								min: 0,
								max: 100,
								stepSize: 10,
								callback: function (value, index, values) {
									return value + '%'
								}
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
			let arr = []
			let data = this.data.results
			for (let i in data) {
				arr.push(moment(data[i].x, 'HH:mm').format('HH:mm a'))
			}
			return arr
		}
	},
	watch: {
		data: function () {
			if (this._chart) {
				this._chart.destroy()
			}
			this.renderLineChart()
		}
	}
})

Vue.component('line-chart', {
	extends: Line,
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
						},
						{
							fill: false,
							borderColor: '#5879a4',
							backgroundColor: '#5879a4',
							data: this.chartData
						}
					]
				},
				{
					title: {
						display: true,
						text: 'No. Of Bookings By Time',
						fontSize: 18,
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
			return arr
		}
	},
	watch: {
		data: function () {
			if (this._chart) {
				this._chart.destroy()
			}
			this.renderLineChart()
		}
	}
})

Vue.component('grouped-bar', {
	extends: Bar,
	props: ['data', 'options'],
	mounted () {
		// this.renderChart(this.data, this.options)
		this.renderBarChart()
	},
	methods: {
		renderGroupBarChart: function () {
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
						text: 'Avg. No. Of Bookings By Day',
						fontSize: 18,
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
			this.renderGroupBarChart()
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
						text: 'Daily Avg. No. Of Bookings',
						fontSize: 18,
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
		this.renderDoughnutChart()
	},
	methods: {
		renderDoughnutChart: function () {
			this.renderChart(
				{
					datasets: [
						{
							backgroundColor: ['#5879a4', '#3cba9f', '#e8c3b9', '#c45850', '#ea344f', '#f4ac32'],
							data: this.chartData.data
						}
					],
					labels: this.chartData.stations
				},
				{
					title: {
						display: true,
						text: 'Overall Booking Percentage By Stations',
						fontSize: 18,
						padding: 5,
						lineHeight: 2
					},
					pieceLabel: {
						render: 'percentage',
						fontColor: 'white',
						precision: 1
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
