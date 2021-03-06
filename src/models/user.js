const Mongoose = require('mongoose')
const AutoIncrement = require('mongoose-auto-increment')

const userSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: true,
      index: {
        unique: true
      }
    },
    balance: {
      type: Number,
      required: false
    }
  },
  { timestamps: true }
)

userSchema.method('toClient', function () {
  var obj = this.toObject()

  //Rename fields
  obj.id = obj._id

  // Delete fields
  delete obj._id
  delete obj.__v
  delete obj.createdAt
  delete obj.updatedAt

  return obj
})

userSchema.plugin(AutoIncrement.plugin, {
  model: 'User',
  startAt: 1
})

Mongoose.model('User', userSchema)

module.exports = Mongoose.model('User')
