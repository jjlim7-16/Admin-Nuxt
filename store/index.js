import Vuex from 'vuex'

const createStore = () => {
	return new Vuex.Store({
		state: {
			pageName: ''
		},
		mutations: {
			setPageTitle (state, payload) {
				state.pageName = payload
			}
		}
	})
}

export default createStore
