const User = require('../models/user')

const repositories = {

    findById: async (id) => User.findById(id).exec(),

    findByEmail: async (ctx) => User.findOne({ email: ctx.request.body.email }).exec(),

    findUsers: async () => User.find({}).exec(),

    findByIdAndDelete: async (id) => User.findByIdAndDelete(id).exec(),

    toClient: (user) => user.toClient(),

    create: async (ctx) => {
        user = new User({
            name: ctx.request.body.name,
            email: ctx.request.body.email,
            balance: 0
        })
        await user.save()
        return user.toClient()
    },

    update: async (ctx) => {
        const user = ctx.user
        user.name = ctx.request.body.name
        user.email = ctx.request.body.email
        await user.save()
        return user.toClient()
    },

    // REFATORAR O SERVIÇO DE LANÇAMENTOS
    /*
    const delete = async (ctx) => {
        const n = await Record.countDocuments({ owner: ctx.user._id }).exec()
        if (n > 0) return ctx.status = 409
        await User.findByIdAndDelete(ctx.user._id).exec()
    }
    */

    list: async (ctx) => {
        const users = await repositories.findUsers()
        for (let i = 0; i < users.length; i++) {
            users[i] = users[i].toClient()
        }
        return users
    },

    /*
    const n = await Record.countDocuments().exec()
            if (n > 0) return ctx.status = 409
            await User.deleteMany().exec()
            ctx.status = 204
    */

    updateBalance: async (ctx) => {
        const user = ctx.user
        user.balance += ctx.request.body.value
        await user.save()
    }
}

module.exports = repositories
