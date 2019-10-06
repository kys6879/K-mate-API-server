const crypto = require('crypto');

const createHash = (password) => {
    return crypto.createHash('sha512').update(password).digest('hex')
}

module.exports = {
    createHash: createHash
}