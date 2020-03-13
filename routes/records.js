const records = require('../controllers/records')

module.exports = (router) => {
    router
        .param('record_id', records.getById)
        .post('/records/', records.create)
        .get('/records/:record_id', records.read)
        .put('/records/:record_id', records.update)
        .delete('/records/:record_id', records.delete)
        .get('/records/', records.list)
        .delete('/records/', records.clear)
}