const User = require('../repositories/users')

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
        const documents = await User.delete(ctx)
        documents === 0 ? ctx.status = 204 : ctx.status = 409
    },

    list: async (ctx) => {
        ctx.body = await User.list()
        ctx.status = 200
    },

    clear: async (ctx) => {
        const documents = await User.clear()
        documents === 0 ? ctx.status = 204 : ctx.status = 409
    }
}

module.exports = controller
