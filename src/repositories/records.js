Record = require('../models/record')
RecordServices = require('../services/records')
UserServices = require('../services/users')

const repositories = {
  toClient: record => record.toClient(),

  findById: async id =>
    await Record.findById(id)
      .populate('owner')
      .exec(),
  findRecords: async () =>
    await Record.find()
      .populate('owner')
      .exec(),

  create: async ctx => {
    const record = new Record(ctx.request.body)
    await Record.populate(record, { path: 'owner' })

    record.type = RecordServices.setTypeByValue(record.value)

    UserServices.updateBalance(ctx)

    await record.save()
    return record.toClient()
  },

  update: async ctx => {
    const record = await Record.findById(ctx.params.record_id)

    // value to update the balance
    const updateBalanceValue = ctx.request.body.value - record.value

    record.value = ctx.request.body.value
    await Record.populate(record, { path: 'owner' })
    record.type = RecordServices.setTypeByValue(record.value)

    ctx.request.body.value = updateBalanceValue
    await UserServices.updateBalance(ctx)

    await record.save()
    return record.toClient()
  },

  delete: async ctx =>
    await Record.findOneAndDelete({ _id: ctx.record.id }).exec(),

  clear: async () => await Record.deleteMany().exec(),

  list: async ctx => {
    const req = {}
    if (ctx.query.owner_id) {
      try {
        const user = await UserServices.findById(ctx.request.body.owner)
        req.owner = user._id
      } catch (err) {
        req.owner = null
      }
    }
    if (ctx.user) req.owner = ctx.user._id
    const records = await Record.find(req)
      .populate('owner')
      .exec()
    for (let i = 0; i < records.length; i++) {
      records[i] = records[i].toClient()
    }
    return records
  }
}

module.exports = repositories
