const User = require('../models/user')

const repositories = {

    toClient: (user) => user.toClient(),

    findById: async (id) => User.findById(id).exec(),
    findByEmail: async (ctx) => User.findOne({ email: ctx.request.body.email }).exec(),
    findUsers: async () => User.find().exec(),

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

    delete: async (ctx) => {
        const documents = await Record.countDocuments({ owner: ctx.user._id }).exec()
        if (documents === 0) await User.findByIdAndDelete(ctx.user._id).exec()
        return documents
    },

    clear: async () => {
        const documents = await Record.countDocuments().exec()
        if (documents === 0) await User.deleteMany().exec()
        return documents
    },

    list: async () => {
        const users = await repositories.findUsers()
        for (let i = 0; i < users.length; i++) {
            users[i] = users[i].toClient()
        }
        return users
    },

    updateBalance: async (ctx) => {
        const user = ctx.user
        user.balance += parseInt(ctx.request.body.value)
        await user.save()
    }
}

module.exports = repositories
