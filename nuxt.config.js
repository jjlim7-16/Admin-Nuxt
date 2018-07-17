module.exports = {
	modules: ['nuxt-buefy', '@nuxtjs/axios', '@nuxtjs/auth'],
	auth: {
		strategies: {
			local: {
				endpoints: {
					// login: { url: '/api/auth/login', method: 'post', propertyName: 'token' },
					// logout: { url: '/api/auth/logout', method: 'post' },
					// user: { url: '/api/auth/user', method: 'get', propertyName: 'data' }
					login: { propertyName: 'token.accessToken' }
				},
				tokenRequired: true,
				tokenType: 'bearer'
			}
		},
		redirect: {
			login: '/',
			logout: '/',
			home: '/Admin/Stations',
			callback: '/callback'
		},
		plugins: ['~plugins/auth.js']
	},

	// axios: {
	// 	baseURL: 'http://localhost:8000/api/'
	// },
	plugins: [
		{ src: '~plugins/vee-validate.js', ssr: true },
		{ src: '~plugins/vue-chartjs.js', ssr: false },
		{ src: '~plugins/socket-io.js', ssr: false },
		'~plugins/axios.js'
	],
	/*
	** Headers of the page
	*/
	head: {
		title: 'KidZania',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: 'Nuxt.js project' }
		],
		link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
	},
	serverMiddleware: ['./api/auth'],
	axios: { proxy: true },
	proxy: { '/api/': 'http://localhost:3000' },
	router: { middleware: ['auth'] },
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
