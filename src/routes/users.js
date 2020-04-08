const records = require('../controllers/records')
const users = require('../controllers/users')

module.exports = router => {
  router
    .param('user_id', users.getById)
    .post('/users/', users.create)
    .get('/users/:user_id', users.read)
    .get('/users/:user_id/records/', records.list)
    .put('/users/:user_id', users.update)
    .delete('/users/:user_id', users.delete)
    .get('/users/', users.list)
    .delete('/users/', users.clear)
}
