const User = require('../repositories/users')
const Record = require('../models/record')

const controller = {

    getById: async (id, ctx, next) => {
        try {
            ctx.user = await User.findById(id)
            if (!ctx.user) return ctx.status = 404
            return next()
        } catch (err) {
            ctx.status = 400
        }
    },

    create: async (ctx) => {
        if (!ctx.request.body.email) {
            ctx.status = 400
            return
        }
        const duplicate = await User.findByEmail(ctx)
        if (duplicate) {
            ctx.status = 409
            return
        }
        ctx.body = await User.create(ctx)
        ctx.status = 201
    },

    read: async (ctx) => {
        ctx.body = await User.toClient(ctx.user)
        ctx.status = 200
    },

    update: async (ctx) => {
        if (!ctx.request.body.name || !ctx.request.body.email) {
            ctx.status = 400
            return
        }
        ctx.body = await User.update(ctx)
        ctx.status = 201
    },

    delete: async (ctx) => {
        const n = await Record.countDocuments({ owner: ctx.user._id }).exec()
        if (n > 0) return ctx.status = 409
        await User.findByIdAndDelete(ctx.user._id).exec()
        ctx.status = 204
    },

    list: async (ctx) => {
        ctx.body = await User.list(ctx)
        ctx.status = 200
    },

    clear: async (ctx) => {
        const n = await Record.countDocuments().exec()
        if (n > 0) return ctx.status = 409
        await User.deleteMany().exec()
        ctx.status = 204
    }
}

module.exports = controller
