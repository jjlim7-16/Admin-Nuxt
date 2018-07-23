export default async function ({ app }) {
	if (!app.$auth.loggedIn) {
		return
	}
	console.log(app.$auth.$state.user.user_type)
}
