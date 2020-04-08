const User = require('../repositories/users')

service = {
  findById: async id => await User.findById(id),

  updateBalance: async ctx => await User.updateBalance(ctx)
}

module.exports = service
