export default function ({$axios, redirect, store}) {
	$axios.onRequest(config => {
		config.headers['Content-Type'] = 'application/json'
		config.headers['Access-Control-Allow-Origin'] = '*'
	})

	if (store.state.auth) {
		$axios.setToken(store.state.auth.token, 'Bearer')
		// if (store.state.auth.user.account_type === 'Admin') {
		// 	return redirect('/Admin/Dashboard')
		// } else {
		// 	return redirect(`/Crew/${store.state.auth.user.station_id}`)
		// }
	}
}
