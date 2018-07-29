export default function ({$axios, app, store}) {
	$axios.onRequest(config => {
		config.headers['Content-Type'] = 'application/json'
		config.headers['Access-Control-Allow-Origin'] = '*'
	})

	if (store.state.auth) {
		// config.headers.common['Authorization'] = store.state.auth.token
		$axios.setToken(store.state.auth.token, 'Bearer')
		// $axios.defaults.headers.common.Authorization = store.state.auth.token
	}
}
