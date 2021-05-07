const crypto = require('crypto')

const ALGORITHM = 'aes-256-cbc'

function encrypt({ text, key }) {
    key = Buffer.from(key, 'hex')
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
    let encrypted = cipher.update(text)
    encrypted = Buffer.concat([ encrypted, cipher.final()])
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted.toString('hex')
    }
}

function decrypt({ encryptedText, key, iv }) {
    key = Buffer.from(key, 'hex')
    const encryptedData = Buffer.from(encryptedText, 'hex')
    const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(iv, 'hex'))
    let decrypted = decipher.update(encryptedData)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
}

// const key = crypto.randomBytes(32).toString('hex')
// console.log('Key:', key)
// const result = encrypt({
//     text: 'My name is Dushyant',
//     key
// })

// console.log('Encrypted Data:', result)

// const decrypted = decrypt({
//     encryptedText: result.encryptedData,
//     key,
//     iv: result.iv
// })

// console.log('Decrypted Data:', decrypted)


module.exports = {
    encrypt,
    decrypt
}