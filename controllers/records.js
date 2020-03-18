const Record = require('../repositories/records')
const UserServices = require('../services/users')

let controller = {

    getById: async (id, ctx, next) => {
        try {
            ctx.record = await Record.findById(id)
            if (!ctx.record) return ctx.status = 404
            return next()
        } catch (err) {
            ctx.status = 400
        }
    },

    create: async (ctx) => {
        try {
            ctx.user = await UserServices.findById(ctx.request.body.owner)
            if (!ctx.user) return ctx.status = 404

            ctx.body = Record.create(ctx)
            ctx.status = 201
        } catch (err) {
            ctx.status = 400
        }
    },

    read: async (ctx) => {
        ctx.body = ctx.record.toClient()
    },

    update: async (ctx) => {
        try {
            ctx.user = await UserServices.findById(ctx.request.body.owner)
            if (!ctx.user) return ctx.status = 404

            ctx.body = Record.update(ctx)
            ctx.status = 201
        } catch (err) {
            ctx.status = 400
        }
    },

    delete: async (ctx) => {
        await Record.findOneAndDelete({ _id: ctx.record.id }).exec()
        ctx.status = 204
    },

    list: async (ctx) => {
        const req = {}
        if (ctx.query.owner_id) {
            try {
                const user = await UserServices.findById(ctx.request.body.owner).exec()
                req.owner = user._id
            } catch (err) {
                req.owner = null
            }
        }
        if (ctx.user) req.owner = ctx.user._id
        const records = await Record.find(req).populate('owner').exec()
        for (let i = 0; i < records.length; i++) {
            records[i] = records[i].toClient()
        }
        ctx.body = records
    },

    clear: async (ctx) => {
        await Record.deleteMany().exec()
        ctx.status = 204
    }
}

module.exports = controller
