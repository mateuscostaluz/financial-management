const Record = require('../models/record')
const User = require('../models/user')

service = {

    async findById(id) {
        const user = await User.findById(id)
        return user
    },

    async updateBalance(user) {
        user.balance = 0
        const records = await Record.find({}).exec()
        for(let i = 0; i < records.length; i++) {
            user.balance += records[i].value
        }        
        await user.save()
    }
}

module.exports = service