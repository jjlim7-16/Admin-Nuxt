module.exports = {
	Role: function (roleName, capacity, file, stationId = null) {
		this.roleName = roleName
		this.capacity = capacity
		this.file = file
		this.stationId = stationId
	},
	Station: function (name, description, startTime, endTime, duration, roles = null) {
		this.name = name
		this.description = description
		this.startTime = startTime
		this.endTime = endTime
		this.duration = duration
		this.roles = roles
	},
	Limit: function (stationId, roleId, date, limit) {
		this.stationId = stationId
		this.roleId = roleId
		this.date = date
		this.limit = limit
	},
	Reservation: function (date, roleId, sessionId, noOfRSlots, remarks) {
		this.session_id = sessionId
		this.role_id = roleId
		this.date = date
		this.noOfRSlots = noOfRSlots
		this.remarks = remarks
	},
	Account: function (account_type_id, username, password) {
		this.account_type_id = account_type_id
		this.username = username
		this.password = password
	}
}
