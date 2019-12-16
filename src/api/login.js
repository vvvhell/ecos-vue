import Socket from './socket'
import { JSEncrypt } from 'jsencrypt/bin/jsencrypt';
const CryptoJS = require('crypto-js');

export async function getAesKey(data){
    try{
        let socket = new Socket();
        socket.write(JSON.stringify(data));
        let response = await socket.read();
        let obj = JSON.parse(response);
        if (obj.username === data){        //返回信息需要进一步确定
            return obj
        } else {
            throw new Error(obj.errormessage)
        } 
    } catch (e) {
            throw new Error(e.toString())
        }       
}   

export async function submitLogin(data, key){
    try{
        var encKey = CryptoJS.enc.Utf8.parse(key);
        var json =JSON.stringify(data);
        var cipher = CryptoJS.AES.encrypt(json, encKey, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
          });
        let socket = new Socket();
        socket.write(cipher);
        let response = await socket.read();
        let obj = JSON.parse(response);
        if (obj.username === data){        //返回信息需要进一步确定
            return obj
        } else {
            throw new Error(obj.errormessage)
        } 
    } catch (e) {
            throw new Error(e.toString())
        }       
}

export function aesEncrypt(data, key){
    var encKey = CryptoJS.enc.Utf8.parse(key);
    var json =JSON.stringify(data);
    var cipher = CryptoJS.AES.encrypt(json, encKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
    return cipher.ciphertext.toString(CryptoJS.enc.Base64);
}
export function aesDecrypt(data, key){
    var encKey = CryptoJS.enc.Utf8.parse(key);
    var base64 = CryptoJS.enc.Base64.parse(data);
    var src = CryptoJS.enc.Base64.stringify(base64);
    var decrypt = CryptoJS.AES.decrypt(src, encKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });
    return decrypt.toString(CryptoJS.enc.Utf8);
    //return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}
export function rsaDecrypt(data){
    let jse = new JSEncrypt();
    jse.setPrivateKey('');
    return jse.decrypt(data);
}