const UserController = require('../controllers/users')

service = {

    findById(id) {
        return UserController.findById(id)
    },

    updateBalance(body) {
        UserController.updateBalance(body)
    }
}

module.exports = service