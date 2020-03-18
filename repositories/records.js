Record = require('../models/record')
RecordServices = require('../services/records')
UserServices = require('../services/users')

const repositories = {

    findById: async (id) => await Record.findById(id).populate('owner').exec(),

    create: async (ctx) => {
        const record = new Record(ctx.request.body)
        await Record.populate(record, { path: 'owner' })
        record.type = RecordServices.setTypeByValue(record.value)
        UserServices.updateBalance(ctx)
        await record.save()
        return record.toClient()
    },

    update: async (ctx) => {
        const record = await Record.findById(ctx.params.record_id)
        await Record.populate(record, { path: 'owner' })
        record.value = ctx.request.body.value
        record.type = RecordServices.setTypeByValue(record.value)
        ctx.request.body.value += record.value
        UserServices.updateBalance(ctx)
        await record.save()
        ctx.body = record.toClient()
    }
}

module.exports = repositories
