const Record = require('../models/record')
const RecordServices = require('../services/records')
const User = require('../models/user')
const UserServices = require('../services/users')

let controller = {

    getById: async(id, ctx, next) => {
        try{
            ctx.record = await Record.findById(id).populate('owner').exec()
            if(!ctx.record) return ctx.status = 404
            return next()
        } catch (err) {
            ctx.status = 404
        }
    },

    create: async (ctx) => {
        try{
            const user = await User.findById(ctx.request.body.owner)          
            const value = ctx.request.body.value
            if(!user) return ctx.status = 400
            let record = new Record({
                value: ctx.request.body.value,
                owner: user._id,
                type: RecordServices.setType(value)
            })
            console.log(ctx.request.body)
            UserServices.updateBalance(ctx.request.body)
            record = await record.save()
            await Record.populate(record, {path: 'owner'})
            ctx.body = record.toClient()
            ctx.status = 201
        } catch (err) {
            ctx.status = 400
        }
    },

    read: async (ctx) => {
        ctx.body = ctx.record.toClient()
    },
    
    update: async (ctx) => {
        try{
            const user = await UserServices.find(ctx.request.body.owner)
            const value = ctx.request.body.value
            if(!user) return ctx.body = 400
            const record = ctx.record
            record.value = ctx.request.body.value
            record.owner = user._id
            record.type = RecordServices.setType(value)
            UserServices.updateBalance(user.id, value)
            await record.save()
            await record.populate('owner').execPopulate()
            ctx.body = record.toClient()
        } catch (err) {
            ctx.status = 400
        }
    },
    
    delete: async (ctx) => {
        await Record.findOneAndDelete({_id: ctx.record.id}).exec()
        ctx.status = 204
    },

    list: async (ctx) => {
        const req = {}
        if (ctx.query.owner_id) {
            try{
                const user = await UserServices.find(ctx.query.owner_id).exec()
                req.owner = user._id
            } catch (err) {
                req.owner = null
            }
        }
        if (ctx.user) req.owner = ctx.user._id
        const records = await Record.find(req).populate('owner').exec()
        for(let i = 0; i < records.length; i++) {
            records[i] = record[i].toClient()
        }
        ctx.body = records
    },
    
    clear: async (ctx) => {
        await Record.deleteMany().exec()
        ctx.status = 204
    }
}

module.exports = controller