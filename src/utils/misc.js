import dateUtils from 'element-ui/lib/utils/date'
import findIndex from 'lodash.findindex'
import Base64Encoder from './base64'
import RSAEncrypt from './rsa'
import * as C from '../constants/constants'

export default {
    isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]'
    },

    isEmpty(obj) {
        return (
            (this.isArray(obj) && obj.length === 0) ||
            typeof obj !== 'object' ||
            Object.keys(obj).length === 0
        )
    },

    findIndex(array, callback) {
        return findIndex(array, callback)
    },

    formatDate(date, format = 'yyyy-MM-dd HH:mm:ss') {
        return dateUtils.format(date, format)
    },

    parseDate(str, format = 'yyyy-MM-dd HH:mm:ss') {
        return dateUtils.parse(str, format)
    },

    trim(str) {
        return `${str}`.replace(/^\s*|\s*$/g, '')
    },

    uuid() {
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
            /[xy]/g,
            function(c) {
                const r = (Math.random() * 16) | 0
                const v = c === 'x' ? r : (r & 0x3) | 0x8
                return v.toString(16)
            }
        )
        return uuid.replace(/-/g, '')
    },

    rsaEncrypt(str) {
        const { RSAKeyPair, RSAConstants, encrypt } = RSAEncrypt
        const keyPair = new RSAKeyPair(
            C.RSA_COMPONENT,
            '',
            C.RSA_MODULUS,
            C.RSA_KEY_LENGTH
        )
        return this.base64Encode(
            encrypt(keyPair, str, RSAConstants.PKCS1Padding)
        )
    },

    base64Encode(str) {
        const btoa = Base64Encoder.encode
        return btoa(str)
    },
    resetSort(name) {
        return (o, p) => {
            let a
            let b
            if (typeof o === 'object' && typeof p === 'object' && o && p) {
                a = o[name]
                b = p[name]
                if (a === b) {
                    return 0
                }
                if (typeof a === typeof b) {
                    return a < b ? -1 : 1
                }
                return typeof a < typeof b ? -1 : 1
            }
        }
    }
}
