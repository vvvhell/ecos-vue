import Vue from 'vue'
import axios from 'axios'
import { JSEncrypt } from 'jsencrypt/bin/jsencrypt';
Vue.prototype.$axios = axios
const CryptoJS = require('crypto-js');


export function getAesKey(data){
    const str = JSON.stringify(data)
    const buf = Buffer.from(str)
    return buf
}
// export function getloginLink(data){

// }

// export async function submitLogin(data, key){
//     try{
//         var encKey = CryptoJS.enc.Utf8.parse(key);
//         var json =JSON.stringify(data);
//         var cipher = CryptoJS.AES.encrypt(json, encKey, {
//             mode: CryptoJS.mode.ECB,
//             padding: CryptoJS.pad.Pkcs7,
//           });
        
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

// export function aesEncrypt(data, key){
//     var encKey = CryptoJS.enc.Utf8.parse(key);
//     var json =JSON.stringify(data);
//     var cipher = CryptoJS.AES.encrypt(json, encKey, {
//         mode: CryptoJS.mode.ECB,
//         padding: CryptoJS.pad.Pkcs7,
//       });
//     return cipher.ciphertext.toString(CryptoJS.enc.Base64);
// }
// export function aesDecrypt(data, key){
//     var encKey = CryptoJS.enc.Utf8.parse(key);
//     var base64 = CryptoJS.enc.Base64.parse(data);
    
//     var decrypt = CryptoJS.AES.decrypt(src, encKey, {
//         mode: CryptoJS.mode.ECB,
//         padding: CryptoJS.pad.Pkcs7,
//     });
//     return decrypt.toString(CryptoJS.enc.Utf8);

// }

let publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAgvkG3fr063cLQ75BqCGY1FOvOG5A6kds+o5lGZ5H/wVY4yw6LH+klkUvywZVmxsz3wWqKiN0vc3GvYyJjY+o6qVDl/GAOthtshgC/OKKiyyCEk58A8n18HkJ6x0zHMfR0GwHcbZ31icVeNv5O/2VReCzdv369RU5exFvrmU+rSgSNJXMG3Rjjgv3KZXNHDSaDQfbu2quUdRfHZLXuc2yzdy2ti9Q+1B/u9RZAlzzyxhK84QUD3QKxs/2RNPZJV2btKaHIQnNnSkdOTl4cbo6fxqhO4XdqThtCdQRtWwvkihPxBEd1vHAF+oqi7QG2WzZsZpvRFjdAg1F0MapdU+xjQIDAQAB'
let privateKey = 'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCC+Qbd+vTrdwtDvkGoIZjUU684bkDqR2z6jmUZnkf/BVjjLDosf6SWRS/LBlWbGzPfBaoqI3S9zca9jImNj6jqpUOX8YA62G2yGAL84oqLLIISTnwDyfXweQnrHTMcx9HQbAdxtnfWJxV42/k7/ZVF4LN2/fr1FTl7EW+uZT6tKBI0lcwbdGOOC/cplc0cNJoNB9u7aq5R1F8dkte5zbLN3La2L1D7UH+71FkCXPPLGErzhBQPdArGz/ZE09klXZu0pochCc2dKR05OXhxujp/GqE7hd2pOG0J1BG1bC+SKE/EER3W8cAX6iqLtAbZbNmxmm9EWN0CDUXQxql1T7GNAgMBAAECggEAFqgPiQzlm2n/d9uMrhIJxwkm8YMZFa3/aySA1rqrx7DcHIhFE/eMuDYFu4BABNHi2jy3oAx8IG1daOLL1MI6PUUTeVBcl1FjQICo26gwwTyUz6fmCh3AvrWhgpuNgPgMEprter1O46vlKgAbkEYgsXLaeMYcyJLAW8q7YBbBjeB2N4reAYUOgPdrRKQsypmk+Skq1hDOikdXDm2ScWaxGB+DOmBkvByO1mmZuePL8aHuGTV56F9BNjNJDQTrF3O6f0T8a9hWdp6fg3Klvi0iH7W0BulcdUtG4HJjVCPHRkCnwepjxmmYatmJnWj/aSCf0mNq3MEl8FIcbpRuUrRbXQKBgQDCObbB8Ug4ru9eYTmFe38I+sw2GoBQTU8W5FI1PEStJBy/NNMX+NoCaPRpQpnPX5mbFQDaIAvDvNgCTb6RhQ0hAgcEnWNkzGQePNmUqroXr9MxElqqE8tri84yGce8Cyim5QEwP0TUHmiDmzLjk6gFSEpwOolPktWCIZP0HBrGOwKBgQCsoSH60tP9CB7Tt6+MahN9iwms6r2ZIfJACDFIWRBiNDPSVvBw/7lUixGchvtlJlUTj5RLe+b3RdeLLsp9P2DlksXnhccwopbtjUAL3Ms+ogfg9hT5OENLhNBW0shYeYT6LCCq5JPn7C9J+Zc52cN0FLJDRiWR9m5qc5Znx6hC1wKBgDNV4dI9HeOtiSMe+38mdxs+fr9GHegbpu3cB0Z+2YAR7W80XR8W7Th52TABJHpFQGpXENSWZ8Wiok1pkxcPXbr9uDEmEGFSDJxZZQEAZxNfq6hqu3/8n2WbnDJt0fcH1ATYvomsD1spdmJioP65xk0vIE2tiyF3I+uzSFHbI9CFAoGAOej//iV1id+Mf9eR41e+XBIlV8WTfuhdXM+iwLNoBJmgfMI/fJi8sjjI2qqJcQAv8BTtWXkiHPdn/D/hG60EM19OVoGRNaaFXQFSZ+hUohk27Wd/167hHFdckJO7M7roOghNmSZ+24Fmx7kb2wNLRwieWGUSu2lg1wMZhIz8zBcCgYEAjwfkhO5YSfusr2Acj3XOSZFbd/2jWd144wjHFyOG1PD0kg5VrOhb6VTLRaH6qAhuotaGKBYQ/u9yN31zP2ddOZO5zxMAI/0SyOZTFdPi2UgiKlVscGr7qQlgD56ctw+b3hOj18J2gCT/uvx0pJtlxk7subgmyUIolpijdWRi9k0='

// export function rsaEncrypt(data){
//     let jse = new JSEncrypt();
//     jse.setPublicKey(publicKey);
//     return jse.encrypt(data);
// }
const jse = new JSEncrypt();
export function rsaDecrypt(data){
		console.log("data", data);


		jse.setPrivateKey(privateKey);
		var a = ""; 
		a = jse.decrypt(data);
		console.log("a", a);
    return jse.decrypt(data); 
}
