const User = require('../models/user')
const Record = require('../models/record')

let controller = {

    getById: async(id, ctx, next) => {
        try{
            ctx.user = await User.findById(id).exec()
            if(!ctx.user) return ctx.status = 404
            return next()
        } catch (err) {
            ctx.status = 404
        }
    },

    create: async (ctx) => {
        if(!ctx.request.body.email) {
            ctx.status = 400
            return
        }
        const duplicate = await User.findOne({email: ctx.request.body.email}).exec()
        if(duplicate) {
            ctx.status = 409
            return
        }
        const user = new User({
            name: ctx.request.body.name,
            email: ctx.request.body.email,
            balance: 0,
        })
        const ret = await user.save()
        ctx.body = ret.toClient()
        ctx.status = 201
    },

    read: async (ctx) => {
        ctx.body = ctx.user.toClient()
    },
    
    update: async (ctx) => {
        const user = ctx.user
        user.name = ctx.request.body.name
        user.email = ctx.request.body.email
        await user.save()
        ctx.body = user.toClient()
    },
    
    delete: async (ctx) => {
        const n = await Record.countDocuments({owner: ctx.user._id}).exec()
        if(n > 0) return ctx.status = 409
        await User.findByIdAndDelete(ctx.user._id).exec()
        ctx.status = 204
    },
    
    list: async (ctx) => {
        const users = await User.find({}).exec()
        for(let i = 0; i < users.length; i++) {
            users[i] = users[i].toClient()
        }
        ctx.body = users
    },
    
    clear: async (ctx) => {
        const n = await Record.countDocuments().exec()
        if(n > 0) return ctx.status = 409
        await User.deleteMany().exec()
        ctx.status = 204
    }
}

module.exports = controller