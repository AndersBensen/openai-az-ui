// import crypto from 'crypto-js';
const crypto = require('crypto');

export class EncryptedStorage {

    constructor(key) {
        this.key = key; // This should be 256 bits
        this.algorithm = 'aes-256-cbc';
    }

    #encrypt(text) {
        let iv = crypto.randomBytes(16);
        let cipher = crypto.createCipheriv(
            this.algorithm,
            Buffer.from(this.key),
            iv
        );

        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString("hex") + ":" + encrypted.toString("hex");
    }

    #decrypt(encodedText) {
        let textParts = encodedText.split(":");
        let iv = Buffer.from(textParts.shift(), "hex");
        let encryptedText = Buffer.from(textParts.join(":"), "hex");
        let decipher = crypto.createDecipheriv(
            this.algorithm,
            Buffer.from(this.key),
            iv
        );

        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }

    // ?? ###### An implementation to encrypt messages only ########## ??
    // setItem(key, value) {
    //     console.log("hi", {key}, {value})
    //     if (key == 'conversations') {
    //         value.forEach(conv => {
    //             console.log("conv",{conv})
    //             conv.messages.map(message => {
    //                 message.content = crypto.AES.encrypt(message.content, this.salt).toString();
    //             })
    //         })
    //     }
    //     localStorage.setItem(key, JSON.stringify(value))
    //     // const encryptedValue = crypto.AES.encrypt(JSON.stringify(value), this.salt).toString();
    //     // localStorage.setItem(key, encryptedValue)
    // }


    // // ?? ###### An implementation to encrypt messages only ########## ??
    // getItem(key) {
    //     if ((key == 'conversations') && (localStorage.getItem(key))) {
    //         var conversations = JSON.parse(localStorage.getItem(key))
    //         conversations.forEach(conv => {
    //             console.log("conv",{conv})
    //             conv.messages.map(message => {
    //                 const bytes = crypto.AES.decrypt(message.content, this.salt)
    //                 const decryptedValue = JSON.parse(bytes.toString(crypto.enc.Utf8))
    //                 message.content = decryptedValue
    //             })
    //         })
    //         return conversations
    //     } else {
    //         return JSON.parse(localStorage.getItem(key))
    //     }
    //     // const encryptedValue = localStorage.getItem(key)
    //     // // If people already have non-encrypted conversations we need a try/catch
    //     // if (encryptedValue) { 
    //     //     try {
    //     //         const bytes = crypto.AES.decrypt(encryptedValue, this.salt)
    //     //         const decryptedValue = JSON.parse(bytes.toString(crypto.enc.Utf8))
    
    //     //         return decryptedValue
    //     //     } catch (err) {
    //     //         return ""
    //     //     }
    //     // } 
    //     // else {
    //     //     return ""
    //     // }
    // }


    // !! ###### An implementation to encrypt entire conversations ########## !!
    setItem(key, value) {
        // localStorage.setItem(key, JSON.stringify(value))
        // const encryptedValue = crypto.AES.encrypt(JSON.stringify(value), this.salt).toString();
        const encryptedValue = this.#encrypt(JSON.stringify(value))

        localStorage.setItem(key, encryptedValue)
    }

    // !! ###### An implementation to encrypt entire conversations ########## !!
    getItem(key) {
        // const encryptedValue = JSON.parse(localStorage.getItem(key))
        // return encryptedValue
        const encryptedValue = localStorage.getItem(key)
        // If people already have non-encrypted conversations we need a try/catch
        if (encryptedValue) { 
            try {
                const decryptedValue = JSON.parse(this.#decrypt(encryptedValue))
    
                return decryptedValue
            } catch (err) {
                console.log("we fucked up")
                console.log(err)
                return ""
            }
        } 
        else {
            return ""
        }
    }

    removeItem(key) {
        localStorage.removeItem(key)
    }

}