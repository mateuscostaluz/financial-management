service = {

    setType(value) {
        let type = value > 0 ? 'Receita' : 'Despesa'
        return type  
    }
}

module.exports = service