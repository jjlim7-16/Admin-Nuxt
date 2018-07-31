// export default function ({ store, redirect }) {
// 	if (!store.state.auth) {
// 		return redirect('/')
// 	}
// 	if (store.state.auth.user) {
// 		if (store.state.auth.user.account_type === 'Admin') {
// 			return redirect('/Admin/Dashboard')
// 		}
// 		return redirect(`/Crew/${store.state.auth.user.station_id}`)
// 	}
// }
