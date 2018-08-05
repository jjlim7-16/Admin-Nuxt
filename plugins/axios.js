export default function ({$axios, redirect, store}) {
	$axios.onRequest(config => {
		config.headers['Content-Type'] = 'application/json'
		config.headers['Access-Control-Allow-Origin'] = '*'
	})

	if (store.state.auth) {
		$axios.setToken(store.state.auth.token, 'Bearer')
	}
}
