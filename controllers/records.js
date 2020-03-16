const RecordServices = require('../services/records')
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
            const user = await UserServices.findById(ctx.request.body.owner)
            if(!user) return ctx.status = 400
            let record = RecordServices.newRecord()
            record.value = ctx.request.body.value
            record.owner = user._id
            record.type = RecordServices.setType(record.value)
            record = await record.save()
            UserServices.updateBalance(user._id, record.value)
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
            const user = await UserServices.findById(ctx.request.body.owner)
            if(!user) return ctx.body = 400
            const value = ctx.request.body.value
            const record = ctx.record
            record.value = ctx.request.body.value
            record.owner = user._id
            record.type = RecordServices.setType(value)
            UserServices.updateBalance(user, value)
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
                const user = await UserServices.findById(ctx.request.body.owner).exec()
                req.owner = user._id
            } catch (err) {
                req.owner = null
            }
        }
        if (ctx.user) req.owner = ctx.user._id
        const records = await Record.find(req).populate('owner').exec()
        for(let i = 0; i < records.length; i++) {
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