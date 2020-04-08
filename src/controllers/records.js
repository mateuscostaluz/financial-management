const Record = require('../repositories/records')

let controller = {
  getById: async (id, ctx, next) => {
    try {
      ctx.record = await Record.findById(id)
      if (!ctx.record) return (ctx.status = 404)
      return next()
    } catch (err) {
      ctx.status = 400
    }
  },

  create: async ctx => {
    try {
      ctx.user = await UserServices.findById(ctx.request.body.owner)
      if (!ctx.user) return (ctx.status = 404)

      ctx.body = Record.create(ctx)
      ctx.status = 201
    } catch (err) {
      ctx.status = 400
    }
  },

  read: async ctx => {
    ctx.body = Record.toClient(ctx.record)
    ctx.status = 200
  },

  update: async ctx => {
    try {
      ctx.user = await UserServices.findById(ctx.request.body.owner)
      if (!ctx.user) return (ctx.status = 404)

      ctx.body = Record.update(ctx)
      ctx.status = 201
    } catch (err) {
      ctx.status = 400
    }
  },

  delete: async ctx => {
    ctx.body = Record.delete(ctx)
  },

  list: async ctx => {
    ctx.body = await Record.list(ctx)
    ctx.status = 200
  },

  clear: async ctx => {
    ctx.body = await Record.clear()
  }
}

module.exports = controller
