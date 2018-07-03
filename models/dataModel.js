module.exports = {
	Role: function (roleName, capacity, duration, noOfRSlots, file, stationId = null) {
		this.roleName = roleName
		this.capacity = capacity
		this.duration = duration
		this.noOfRSlots = noOfRSlots
		this.file = file
		this.stationId = stationId
	},
	Station: function (name, description, startTime, endTime, roles) {
		this.name = name
		this.description = description
		this.startTime = startTime
		this.endTime = endTime
		this.roles = roles
	}
}
