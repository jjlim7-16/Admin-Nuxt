export default async function ({ app }) {
	if (!app.$auth.loggedIn) {
		return
	}
	const auth = app.$auth
	console.log(auth.$state.user.scope)
}
