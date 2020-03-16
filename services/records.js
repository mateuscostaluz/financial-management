const Record = require('../models/record')

service = {
    newRecord() {
        return new Record()
    },

    setType(value) {
        let type = value > 0 ? 'Receita' : 'Despesa'
        return type  
    }
}

module.exports = service