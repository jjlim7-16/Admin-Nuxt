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
			}
		},
		actions: {
			nuxtServerInit ({ commit }, { req }) {
				let accessToken = null
				if (req.headers.cookie) {
					var parsed = cookieparser.parse(req.headers.cookie)
					accessToken = JSON.parse(parsed.auth)
				}
				commit('update', accessToken)
			}
		}
	})
}

export default createStore
