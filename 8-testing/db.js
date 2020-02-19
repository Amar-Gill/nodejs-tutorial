module.exports.getCustomerSync = function(id) {
    console.log('Reading customer from MongoDB...')
    return { id: id, points: 11 }
}

module.exports.getCustomer = async function(id) {
    return new Promise((resolve, reject) => {
        console.log('Reading customer from MongoDB...')
        resolve( {id: id, points:11} )
    })
}