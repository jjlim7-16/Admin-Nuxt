const config = require('./config')
const cookieParser = require('cookie-parser')
const jwt = require('express-jwt')
const jsonwebtoken = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mysql = require('mysql')
const express = require('express')
const bodyParser = require('body-parser')

// Create express router
// const router = express.Router()

// Transform req & res to have the same API as express
// So we can use res.status() & res.json()
const db = mysql.createConnection(config.db)
const app = express()
app.use(bodyParser.json())
app.use(
	bodyParser.urlencoded({
		extended: true
	})
)
// Install middleware
app.use(cookieParser())
app.use(bodyParser.json())

app.use(
	jwt({
		secret: 'dummy'
	}).unless({
		path: '/api/auth/login'
	})
)
// router.use((req, res, next) => {
// 	Object.setPrototypeOf(req, app.request)
// 	Object.setPrototypeOf(res, app.response)
// 	req.res = res
// 	res.req = req
// 	next()
// })

// Add POST - /api/login
app.post('/login', (req, res) => {
	const username = req.body.username
	const password = req.body.password

	if (!username || !password) {
		return res.status(400).json({
			type: 'error',
			message: 'Username and password fields are required'
		})
	}

	let sql = 'Select username, password_hash, account_type from user_accounts ua, account_type a ' +
	'where a.account_type_id = ua.account_type_id AND username = ?'

	db.query(sql, username, (error, results) => {
		if (error) {
			return res.status(500).json({type: 'error', message: 'db error', error})
		}
		if (results.length === 0) {
			return res.status(403).json({
				type: 'error', message: 'User with provided username not found in database.'
			})
		}
		const user = results[0]
		bcrypt.compare(password, user.password_hash, (error, result) => {
			if (error) return res.status(500).json({type: 'error', message: 'bcrypt error', error})
			if (result) {
				// let token = jsonwebtoken.sign({id: user.id, username: user.username}, config.jwtToken, {expiresIn: 7})
				// req.session.authUser = { session: username }
				// res.setHeader('Set-Cookie', [`access_token=${token}`])
				// res.json({
				// 	type: 'success',
				// 	message: 'User logged in.',
				// 	user: {id: user.id, username: user.username, usertype: user.account_type},
				// 	token: token
				// })
				const accessToken = jsonwebtoken.sign(
					{
						username,
						name: 'User ' + username,
						scope: ['test', 'user']
					},
					'dummy'
				)
				// req.session.authUser = { session: username }
				res.json({
					token: { accessToken }
				})
			} else {
				return res.status(403).json({type: 'error', message: 'Password is incorrect.'})
			}
		})
	})
})

// [GET] /user
app.get('/user', (req, res, next) => {
	res.json({ user: req.user })
})

// Add POST - /api/logout
app.post('/logout', (req, res) => {
	// delete req.session.authUser
	res.json({ ok: true })
})

// Error handler
app.use((err, req, res, next) => {
	console.error(err) // eslint-disable-line no-console
	res.status(401).send(err + '')
})

// Export the server middleware
module.exports = {
	path: '/api/auth',
	handler: app
}
