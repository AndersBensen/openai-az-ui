import crypto from 'crypto-js';


export class EncryptedStorage {

    constructor(salt) {
        this.salt = salt;
    }

    // ?? ###### An implementation to encrypt messages only ########## ??
    setItem(key, value) {
        console.log("hi", {key}, {value})
        if (key == 'conversations') {
            value.forEach(conv => {
                console.log("conv",{conv})
                conv.messages.map(message => {
                    message.content = crypto.AES.encrypt(message.content, this.salt).toString();
                })
            })
        }
        localStorage.setItem(key, JSON.stringify(value))
        // const encryptedValue = crypto.AES.encrypt(JSON.stringify(value), this.salt).toString();
        // localStorage.setItem(key, encryptedValue)
    }


    // ?? ###### An implementation to encrypt messages only ########## ??
    getItem(key) {
        if ((key == 'conversations') && (localStorage.getItem(key))) {
            var conversations = JSON.parse(localStorage.getItem(key))
            conversations.forEach(conv => {
                console.log("conv",{conv})
                conv.messages.map(message => {
                    const bytes = crypto.AES.decrypt(message.content, this.salt)
                    const decryptedValue = JSON.parse(bytes.toString(crypto.enc.Utf8))
                    message.content = decryptedValue
                })
            })
            return conversations
        } else {
            return JSON.parse(localStorage.getItem(key))
        }
        // const encryptedValue = localStorage.getItem(key)
        // // If people already have non-encrypted conversations we need a try/catch
        // if (encryptedValue) { 
        //     try {
        //         const bytes = crypto.AES.decrypt(encryptedValue, this.salt)
        //         const decryptedValue = JSON.parse(bytes.toString(crypto.enc.Utf8))
    
        //         return decryptedValue
        //     } catch (err) {
        //         return ""
        //     }
        // } 
        // else {
        //     return ""
        // }
    }


    // !! ###### An implementation to encrypt entire conversations ########## !!
    // setItem(key, value) {
    //     // localStorage.setItem(key, JSON.stringify(value))
    //     const encryptedValue = crypto.AES.encrypt(JSON.stringify(value), this.salt).toString();
    //     localStorage.setItem(key, encryptedValue)
    // }

    // !! ###### An implementation to encrypt entire conversations ########## !!
    // getItem(key) {
    //     // const encryptedValue = JSON.parse(localStorage.getItem(key))
    //     // return encryptedValue
    //     const encryptedValue = localStorage.getItem(key)
    //     // If people already have non-encrypted conversations we need a try/catch
    //     if (encryptedValue) { 
    //         try {
    //             const bytes = crypto.AES.decrypt(encryptedValue, this.salt)
    //             const decryptedValue = JSON.parse(bytes.toString(crypto.enc.Utf8))
    
    //             return decryptedValue
    //         } catch (err) {
    //             return ""
    //         }
    //     } 
    //     else {
    //         return ""
    //     }
    // }

    removeItem(key) {
        localStorage.removeItem(key)
    }

}