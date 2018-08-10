module.exports = {
	modules: ['nuxt-buefy', '@nuxtjs/axios', ['@nuxtjs/pwa', { icon: false }]],
	plugins: [
		'~plugins/vee-validate.js',
		{ src: '~plugins/vue-chartjs.js', ssr: false },
		{ src: '~plugins/socket-io.js', ssr: false },
		{ src: '~plugins/axios.js', ssr: false }
	],
	/*
	** Headers of the page
	*/
	head: {
		title: 'Q-zee',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: 'Nuxt.js project' }
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
			{ rel: 'stylesheet', type: 'text/css', href: '/css/materialdesignicons.min.css' }
		]
	},
	/*
	** Customize the progress bar color
	*/
	loading: { color: '#3366FF' },
	mode: 'universal',
	/*
	** Build configuration
	*/
	build: {
		/*
		** Run ESLint on save
		*/
		vendor: [
			'chart.js',
			'vue-chartjs'
		],
		extend (config, { isDev, isClient }) {
			if (isDev && isClient) {
				config.resolve.alias['vue'] = 'vue/dist/vue.common'
				// config.module.rules.push({
				// 	enforce: 'pre',
				// 	test: /\.(js|vue)$/,
				// 	loader: 'eslint-loader',
				// 	exclude: /(node_modules)/
				// })
			}
		}
	}
}
