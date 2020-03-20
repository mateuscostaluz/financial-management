const Record = require('../repositories/records')

service = {
    setTypeByValue: (value) => {
        let type = ''
        if (value === 0) {
            type = 'N/A'
        } else {
            type = value > 0 ? 'Receita' : 'Despesa'
        }
        return type
    }
}

module.exports = service
