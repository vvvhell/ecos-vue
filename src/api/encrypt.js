import Vue from 'vue'
import axios from 'axios'
import { JSEncrypt } from 'jsencrypt/bin/jsencrypt';
Vue.prototype.$axios = axios
const CryptoJS = require('crypto-js');
//用于和CM服务器通信中的加解密

//字符串转buffer数组
export function transData(data){
    const str = JSON.stringify(data)
    const buf = Buffer.from(str)
		return buf
}
//十六进制字符串转byte数组
// function Str2Bytes(str){ 
//     var pos = 0; 
//     var len = str.length; 
//     if(len %2 != 0) 
//     {
//       return null; 
//     } 
//     len /= 2;
//     var hexA = new Array();
//     for(var i=0; i<len; i++) 
//     { 
//        var s = str.substr(pos, 2); 
//        var v = parseInt(s, 16); 
//        hexA.push(v); 
//        pos += 2; 
//     } 
//     return hexA;
// }
//AES加密
export function aesEncrypt(data, key){
    var msg = JSON.stringify(data);
    var encKey = CryptoJS.enc.Base64.parse(key);
    var cipher = CryptoJS.AES.encrypt(msg, encKey, 
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
      );
    var a = CryptoJS.enc.Base64.stringify(cipher.ciphertext);
    console.log('a',a);
    return a;
}
//AES解密测试
// export function aesDecrypt(){
//   var data = 'h9C4s8VnLXsIhuDZ/3KL2MbbIqTbM9JDeiWsQCwNXSKhGFRjR9Ou/iDRERjg8i+IN4a3Fm2aGrzPkXhgqgdZHg=='
//   console.log("data",data);
//   var encKey = CryptoJS.enc.Base64.parse('ZVcLwrD1vkmF8cOclep+qFqAQjfzOY5jbsUlGrqDBsY=');
//   console.log("encKey",encKey);
//   var cipher = CryptoJS.AES.decrypt(data, encKey, 
//     {
//       mode: CryptoJS.mode.ECB,
//       padding: CryptoJS.pad.Pkcs7,
//     }
//     );
//   var str = CryptoJS.enc.Utf8.stringify(cipher);
//   console.log(str);
//   var json =JSON.stringify(str);
//   console.log(JSON.parse(json))
// }
//RSA解密
export function rsaDecrypt(data){
	const privateKey = 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCUXE1H9n+uRZWxKU0jpRq1blVNyxpx/6lX4GzUErPoLa9sgxF8GU//6xwcqfq+ngFwL51Z07Tt9I8Tm41wSTHBj20f9zOJvWYCodULhAuxwUUeWjnlBCgPUlCJvhIHfV01+sFJBlsogs+BfV9jSYNEphpQLAY/PBuSmObBmGFlzeg0fKCxgTAQMBd0qSO30Co0aOE7TQhjae6OvNFrd6HlHhnhKf6e05wjPyWnb7CtBKDUOGTHimqcp2K8RyN3poiZSsVgYIUoAeLrXKk3bO/8OZd+pyPSiZ/JvOnIoJ6ZZSrUB30fAltaSWYZoytG/rUPX2lO5QRr0AlXmPMbV9WBAgMBAAECggEAAe0s57lQsR+gMPu7T7IuJZr4Kplvj3llZom4gAx6H5KwS3VsPbNKcaVI6Spf4ifFFwLXRTpViB172iJT9NhOeBf3r8mS9r/p2jDlxk+Bo15CGoHLbKjgKErGVvOL4mMDWdcWuW8GsgD41tKc8Xob5UFO6CmaLyoFpaKspGjpItxDjPw6cd0r6fJ5Di3SdgZ9+DizTGzoOWl9H9kDpbhnqkLiyrwjEjXOmAzO7pDWh0QATV2/DE2KjVtbmZKSlI4MIyKAv2lf997lQ7iVtgXJ37vGab+oPRIg2jjAHaJJgkvL49OejJX2LYKKQsMUDZS3Ma6t/S5mk0SNb0ysQSQ/QQKBgQDN7UsUp/YA4f7sdwvE9C3iWj14Kv1Es3pNuP0DBYWK4gX8aUima8XKbvHZ8Y8RxnsFkZd4CQU/MaY/yRI5KVMyS1sianIWtTWShkrjO6INYl7E28YJcQYBxdByAUCgL9wdwlQkbuUjsrl+XrsCUlcp9XV5orYctn40jO5XwuOjaQKBgQC4b5H7UFo3kVjgMMqaEnaptKqAfXLD5F2RZEwkNmZkbIRlLZk0mRHJ7QlQtj9Z+yKN6d8SCAthS7739A6qMUH7ZrY2/bdEQmgZdaj1B6zVgjIEak20Lt2WFrG0uuuIUHmnNCRXuUk1aCxm4x12EZpf9sFsjkjZXlfv6QRi2MEWWQKBgQDKc6Nf8G0TmxvUAInqnSFLKurJ7IHI/CaeqOLeCJys2N+Hsz6Alu4CwiY13Z2JnTevVt6yXTPyV+6ZQSYQWod3p8w2Pq5hks/TeQHA+wyr2e1P3r2I5LxCG+d9XavakJL4EuhEVV4jRX/GNH3on2kgUDipWAVwnx3erjtYvrqsGQKBgDgzNyZ/S55XGd/mvjXInoQD21if4VKzyZc+Gr2GHhlHv+gcxuxyICuJoScJAbDnh5X6x9B0xxL0w9JGehl+PP7gQ3HqSefw3Eu1wLA5kH7W12rlAZyAE2FitO+/bXnyG7/JcbGRci9l+PG5DwclQgcv56yuhqBF0UH3nTCJn/yxAoGBAIDJJtaVBPNCZ4KkIMg/TRdMwEAqJuKVBzYn/xsNNTJlmp9XX9EsNlH590xz8KlqNpLkNJJYsy/Jk4EVEUfV2IovhGkUrIcmLb5UbTCItO2arpHh/6wne9iA5CnmZREyfLUpnueg0V2TKQwmdjGqN9U5RpVE1+H2TPfUJ4j+53Hv';
	let jse = new JSEncrypt();
	jse.setPrivateKey(privateKey);
	var key = jse.decrypt(data);
	console.log("key", key);
	return key; 
}
