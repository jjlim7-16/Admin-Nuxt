module.exports = {
	Role: function (roleName, capacity, duration, file, stationId = null) {
		this.roleName = roleName
		this.capacity = capacity
		this.duration = duration
		this.file = file
		this.stationId = stationId
	},
	Station: function (name, description, noOfRSlots, startTime, endTime, roles) {
		this.name = name
		this.description = description
		this.noOfRSlots = noOfRSlots
		this.startTime = startTime
		this.endTime = endTime
		this.roles = roles
	}
}
