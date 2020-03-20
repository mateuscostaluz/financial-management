const Mongoose = require('mongoose')
const AutoIncrement = require('mongoose-auto-increment')

const recordSchema = new Mongoose.Schema(
    {
        value: {
            type: Number,
            required: true,
        },
        owner: {
            type: Number,
            required: true,
            ref: 'User'
        },
        type: {
            type: String,
            required: false
        }
    },
    { timestamps: true }
)

recordSchema.method('toClient', function () {
    var obj = this.toObject()

    //Rename fields
    obj.id = obj._id
    obj.owner = {
        id: obj.owner._id,
        email: obj.owner.email,
    }

    // Delete fields
    delete obj._id
    delete obj.__v
    delete obj.createdAt
    delete obj.updatedAt

    return obj
})

recordSchema.plugin(AutoIncrement.plugin, {
    model: 'Record',
    startAt: 1,
})

Mongoose.model('Record', recordSchema)

module.exports = Mongoose.model('Record')
