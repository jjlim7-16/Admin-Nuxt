import Vuex from 'vuex'
var cookieparser = require('cookieparser')

const createStore = () => {
	return new Vuex.Store({
		state: {
			pageName: '',
			auth: null
		},
		mutations: {
			setPageTitle (state, payload) {
				state.pageName = payload
			},
			update (state, data) {
				state.auth = data
			},
			setSocket (state, socket) {
				state.io = socket
				console.log('Socket Connected')
			}
		},
		actions: {
			nuxtServerInit ({commit}, {req}) {
				let accessToken = null
				if (req.headers.cookie) {
					var parsed = cookieparser.parse(req.headers.cookie)
					if (parsed.auth) {
						accessToken = JSON.parse(parsed.auth)
					}
				}
				commit('update', accessToken)
			},
			logout ({commit}) {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						commit('update', null)
						resolve()
					}, 1000)
				})
			}
		}
	})
}

export default createStore
