const Record = require('../models/record')

service = {
    newRecord() {
        return new Record()
    },

    setTypeByValue(value) {
        let type = ''
        if(value === 0) {
            type = 'Nulo'
        } else {
            type = value > 0 ? 'Receita' : 'Despesa'
        }
        return type  
    }
}

module.exports = service