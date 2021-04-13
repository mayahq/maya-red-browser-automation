const axios = require("axios")
const { encrypt, decrypt } = require('./encryption')

const baseURL = 'http://127.0.0.1:29568/api'
console.log("baseURL", baseURL)
const axiosInstance = axios.create({ baseURL })

class API {
    static post(secretKey, data) {
        return new Promise((resolve, reject) => {
            console.log('decrypted request:', data)
            const { type, payload, timeout } = data
            const toEncrypt = JSON.stringify({ type, payload })
            const { encryptedData, iv } = encrypt({
                text: toEncrypt,
                key: secretKey
            })
            const encryptedRequest = {
                data: encryptedData,
                iv: iv,
                timeout: timeout
            }
            console.log('encrypted request:', encryptedRequest)

            axiosInstance.post('', encryptedRequest)
                .then((response) => {
                    console.log('encrypted response:', response.data)
                    const { data, iv } = response.data
                    const decrypted = decrypt({
                        encryptedText: data,
                        key: secretKey,
                        iv: iv
                    })
                    response.data = JSON.parse(decrypted)
                    console.log('decrypted response:', response.data)
                    resolve(response)
                })
                .catch((e) => reject(e))
        })

    }
}



module.exports = API