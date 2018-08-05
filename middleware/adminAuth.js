export default function ({ store, redirect }) {
	const auth = store.state.auth
	if (!auth) {
		return redirect('/')
	}
	if (auth.user.account_type === 'Crew') {
		return redirect(`/Crew/${store.state.auth.user.station_id}`)
	}
}
