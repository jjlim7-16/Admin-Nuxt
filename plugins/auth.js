export default async function ({ app }) {
	if (!app.$auth.loggedIn) {
		return
	}
	const auth = app.$auth
	console.log(auth.$state.user.user_type)
	const usertype = auth.$state.user.user_type
	if (usertype === 'Admin') {
		// auth.$auth.redirect('/Admin/Stations')
		app.router.push('/Admin/Stations')
	}
}
