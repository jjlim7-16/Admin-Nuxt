export default async function ({ app }) {
	console.log(app.store.state.loggedIn)
	if (!app.store.state.loggedIn) {
		return
	}
	console.log(app.store.state.loggedIn)
}
