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
	Reservation: function (date, stationId, roleId, reservedFrom, reservedTo, remarks) {
		this.stationId = stationId
		this.roleId = roleId
		this.date = date
		this.reservedFrom = reservedFrom
		this.reservedTo = reservedTo
		this.remarks = remarks
	}
}
