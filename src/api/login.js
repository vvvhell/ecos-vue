import Vue from 'vue'
import axios from 'axios'
import {Message} from 'element-ui'
import { JSEncrypt } from 'jsencrypt/bin/jsencrypt';
Vue.prototype.$axios = axios
const CryptoJS = require('crypto-js');


var baseURL = 'http://219.223.198.230:10287';
export function getAesKey(data){
    const str = JSON.stringify(data)
    const buf = Buffer.from(str)
    // 获取要传输的字符串长度
    // let num = buf.length
    // // 构建要生成buffer的数组，会往数组头部加4位数字
    // let arr = []
    // arr.push(num / 16581375)
    // num = num % 16581375
    // arr.push(num / 65025)
    // num = num % 65025
    // arr.push(num / 255)
    // num = num % 255
    // arr.push(num)
    // let buf2 = Buffer.from(arr)
    // let buf3 = Buffer.concat([buf2, buf])
    return buf
    // axios({
    //     method:'post',
    //     url:baseURL,
    //     data:buf3
    // }).then((response) =>{
    //     let obj = '';
    //     obj += response;
    //     let AesKey = obj.slice(4);
    //     console.log("this");
    //     console.log("AesKey:"+ AesKey);
    //     console.log("if is JSON"+ JSON.parse(AesKey));
    //     return AesKey;
    // }).catch((error) =>{ 
    //     console.log(error);   
    //     Message({
    //         showClose:true,
    //         message:error,
    //         type:'error',
    //         duration:0
    //     })
    // })
}
export function getloginLink(data){

}


// export async function getAesKey(data){
//     try{
//         let socket = new Socket();
//         socket.write(JSON.stringify(data));
//         let response = await socket.read();
//         let obj = JSON.parse(response);
//         if (obj.username === data){        //返回信息需要进一步确定
//             return obj
//         } else {
//             throw new Error(obj.errormessage)
//         } 
//     } catch (e) {
//             throw new Error(e.toString())
//         }       
// }   

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

}

let publicKey = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuLJw0bH/EpaGGd30oqZWzmdbUWROPS1RnBO6UwHVdvwopE7OBIudQAD8hZz3kl7oQpTcDBQRF2P0pCKJPqUqk7zbZIUsr4WJkupJOBC4gnZZdzuJVpTpeoqkoRNMnGuO/RUhfxitliO0g0XwdeYkPRD26xERNjHv+tv8UMlbuipbfQOwAjZnzYwKVAyRpin5w5sItF61Vy2RC+kgX6qUQsKgv3lxhwMXqXGWnDwgJWNK9buqNCWAsvbJDyC5xU84v2Np3YE6NXMs3gHVuDFH9gMDDH5cRF/6DGjVaJWpoEV7AP0VvuAALj1zCFtG1SqFbt+Z7C3M9/OOGu9PuijUxQIDAQAB"
let privateKey = "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC4snDRsf8SloYZ3fSiplbOZ1tRZE49LVGcE7pTAdV2/CikTs4Ei51AAPyFnPeSXuhClNwMFBEXY/SkIok+pSqTvNtkhSyvhYmS6kk4ELiCdll3O4lWlOl6iqShE0yca479FSF/GK2WI7SDRfB15iQ9EPbrERE2Me/62/xQyVu6Klt9A7ACNmfNjApUDJGmKfnDmwi0XrVXLZEL6SBfqpRCwqC/eXGHAxepcZacPCAlY0r1u6o0JYCy9skPILnFTzi/Y2ndgTo1cyzeAdW4MUf2AwMMflxEX/oMaNVolamgRXsA/RW+4AAuPXMIW0bVKoVu35nsLcz3844a70+6KNTFAgMBAAECggEAFnBHWJKBZKa44AehIumGfkj8RSUkhDYvRgD3kAIXBv+XiG6yhMbZcd8szqbFRRkWqpAfM7B0ax0Pqakwd1XlmFFHbiznwuM8VYb1IkSVxfPO5rdq9gPdYa/aVF9d3VsL4h9hFGnRHP51fcVPc2NkX67h8KkAKE9k0ltLih0Mcc9iuHM1s3sJo7sSjSIaHUrZLUXPBcI3QeQ2Dz8YPRqjGqzVy6cy1+oEJcGzyYhFwnolDekQdRNlClQgABa1FprVj8/p/zbimlJQ+PzUFkhaO8YfwkDeCkM7lNn/nOR+Le4V0DmTEoktlcRfuXwRzY2V46npA+YXrOKQHff0e8zqgQKBgQDerMd3CSbpBt2A0pehbHRqr+Mp+FltJHj3HtDRy45q9pM+7bqAak3UhkP/PocS2/S1k0jM2xGisJ498Yo8xtv8/GnRcy1rTOpiHHXbWQRZgL5J3/q3ukY3JhUJEbB1Pk9NChfptKv1EqqGW8vcaEmVC0XKPEU1asmkqz0YDnqu0QKBgQDUVqLI7jvEAiQ1AHBlmjNjuzPG9JHSMbGUmzJud7kfzXDk7CS4rjQiirb2Xqt+P1bOOpNTutOfUfuciRV0JFQasBYGRu5XEYgbe1Tl4w1Gz0jamb/CRsvUAJPU3Qh5TfRCNe8pds6hOwVGpFXzFiZ4nLXkE/8c0z++VaZvXfRLtQKBgAowj+QjmBM7zDET8fpiEyW6rMOD6Nu0upBcaaPgE8FTTUOo70rnEm6yQjRQ8S9sv1L7zW4KbFEskeE1x2SmmPSHvHPoOGDboTIiKUaDWU6bNJn+1ONJc+McLARBOfjzg/97gcKhEOljFEiXtMl+QDfAz03E2knqfBW7/Ey4hOaxAoGAOH4EOSkIxZE8SM2hGab43SPFFr2iviVydXME69b2bbueuYkKDAhs3nPBUbLGNYRsd9mlsLUX8F9DbdYa2xd/OMp4UZs1dfy4FXeukqrhsWEcpOwa1Hk5aWHt8sgLpRpUTflDc+ij+MlXEgBOzamq+pPW4KNhUC3z25O2ABMjF7ECgYEAux+7kgO9G/4EF3YaJLQ0u7Y2ioBFd0+6nxCw+kEHGZXqMEJo/SUb6XU7hDUgtn1A4+T86TaZnCnzRgDZRc91bi5VX5nsIDbFtMm/0wlmrmx+CvfjPFFEmMpLf5XF3s8Wv2th74+Vf9p/kHCFZR2zaJkMLNYjuhhMAr3+P40vy/8="
export function rsaEncrypt(data){
    let jse = new JSEncrypt();
    jse.setPublicKey(publicKey);
    return jse.encrypt(data);
}
export function rsaDecrypt(data){
    let jse = new JSEncrypt();
    jse.setPrivateKey(privateKey);
    return jse.decrypt(data);
}