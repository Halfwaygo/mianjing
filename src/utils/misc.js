/*import isEmpty from "lodash.isempty";*/
import qs from "querystring";

import isEmpty from "lodash.isempty"
import Base64Encoder from "./base64"
import RSAEncrypt from "./rsa"
import RSAEncrypts from "./rsa"
import * as C from "../constants/api"
import MD5 from 'blueimp-md5'


const utils = {
    //新增加的
    rsaEncrypt(str) {
        const { RSAKeyPair, RSAConstants, encrypt } = RSAEncrypt;
        const keyPair = new RSAKeyPair(C.RSA_COMPONENT, "", C.RSA_MODULUS, C.RSA_KEY_LENGTH);
        return encrypt(keyPair, str, RSAConstants.PKCS1Padding);
    },
    //---------------------------09
    rsaEncrypts(str) {
        const { RSAKeyPair, RSAConstants, encrypt } = RSAEncrypts;
        const keyPair = new RSAKeyPair(C.RSA_COMPONENT, "", C.RSA_MODULUSNEW, C.RSA_KEY_LENGTH);
        return encrypt(keyPair, str, RSAConstants.PKCS1Padding);
    },
    //---------------------09

     rediretToLoginPage(){
         cookies.delCookie(C.COOKIE_SESSION_ID);
         window.location.href='/#/login';
    },

    getAliasText($i18n, $t, key) {
        try {
            const messages = $i18n.messages[$i18n.locale].alias
            const aliasKey = messages[key]
            if( !aliasKey) {
                return key
            }
            const value = $t(aliasKey)
            return value ? value : key
        }catch(e){
            return key
        }
    },

    md5(str){
        return MD5(`${str}`);
    },



    //此处是否为大写
    base64Encode(str) {
        const btoa = Base64Encoder.encode;
        return btoa(str);
    },


    isArray(obj){
        return Object.prototype.toString.call(obj) == '[object Array]'
    },

    isEmpty(value){
        return isEmpty(value)
    },

    trim(value){
        return `${value}`.replace(/^\s*|\s*$/g, '');
    },

    formatLargeData(value) {
        return `${value}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    },
    /**
     * 线性渐变
     * @param {Object} x0 渐变起点
     * @param {Object} y0
     * @param {Object} x1 渐变终点
     * @param {Object} y1
     * @param {Array} colorList 颜色列表
     */
    getLinearGradient(x0, y0, x1, y1, colorList) {
        const ctx = document.createElement('canvas').getContext('2d');
        const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
        for (let i = 0, l = colorList.length; i < l; i++) {
            gradient.addColorStop(colorList[i][0], colorList[i][1]);
        }
        gradient.__nonRecursion = true;
        return gradient;
    },

    parseJSON(value){
        value = `${value}`;
        try {
            value = JSON.parse(value);
        } catch (e) {
            value = eval('(' + value + ')');
        }
        return value;
    },

    oneWeekAgo(){
        return +new Date - 7 * 24 * 60 * 60 * 1000;
    },

    yesterday(){
        return +new Date - 24 * 60 * 60 * 1000
    },

    formatDate(date){
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        return `${year}-${month}-${day}`
    },

    formatDate2(d){ //和formatDate返回格式不对
        let date = new Date(d);
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        return `${year}${month}${day}`
    },

    getDefaultDateRange(){
        const now = +new Date;
        const array = [];
        const oneDayMillionSeconds = 24 * 60 * 60 * 1000;
        let count = 0;
        while (count < 30) {
            array.unshift(this.formatDate(new Date(now - count * oneDayMillionSeconds)));
            count++;
        }
        return array;
    },

    stringify(params){
        return qs.stringify(params);
    },

    transformNumberToChinese(index){
        const map = {
            1: '一',
            2: '二',
            3: '三',
            4: '四',
            5: '五',
            6: '六',
            7: '七',
            8: '八',
            9: '九',
            10: '十',
        };
        index = parseInt(index, 10);
        if (index > 10) {
            throw new Error("只能输入10以内的数字");
        }
        return map[index];
    },

    checkVariable(context, val){
        return new Promise((resolve, reject) => {
            if (context[val]) {
                resolve(val);
            } else {
                const timer = setInterval(() => {
                    if (context[val]) {
                        clearInterval(timer);
                        resolve(val);
                    }
                }, 100);
            }
        })
    },
};

export default utils;


