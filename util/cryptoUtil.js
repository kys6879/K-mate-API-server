const crypto = require('crypto');
// 비밀번호 해쉬
const createHash = (password) => {
    return crypto.createHash('sha512').update(password).digest('hex')
}

module.exports = {
    createHash: createHash
}