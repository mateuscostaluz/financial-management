const RecordServices = require('../services/records')
const User = require('../models/user')

service = {

    async findById(id) {
        const user = await User.findById(id)
        return user
    },

    async updateBalance(id, value) {
        const user = await User.findById(id)
        user.balance += value
        user.save()
    },

    alterBalance(id, value) {
        const user = findById(id)
        if(!user) return ctx.body = 400
        record = RecordServices.newRecord()
        record.value = (value - user.balance)
        record.owner = id
        record.type = setType(value)
        updateBalance(id, value)
    }
}

module.exports = service