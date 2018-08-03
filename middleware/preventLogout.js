export default function ({ store, redirect }) {
	const auth = store.state.auth
	if (!auth) {
		return
	}
	if (auth.user.account_type === 'Admin') {
		return redirect('/Admin/Dashboard')
	} else {
		return redirect(`/Crew/${auth.user.station_id}`)
	}
}
