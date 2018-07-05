import { Bar } from 'vue-chartjs'

export default {
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
					labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
					datasets: [
						{
							label: 'Popularity (Weekday)',
							backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850'],
							data: this.chartData
						}
					]
				},
				{ responsive: true, maintainAspectRatio: false }
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
}
