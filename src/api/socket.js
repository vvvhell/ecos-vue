/**
 * @description 本来想找个库实现同步的socket，类似promise-socket的东西，但是放弃了
 *              这个连接是短连接
 */

let configObj

configObj = {
  host: '219.223.199.19',
  hostBackup: '127.0.0.1'
}
// }
console.log("【CM host IP】" + configObj.host);
console.log("【CM hostBackup IP】" + configObj.hostBackup);

const net = require('net')

class Socket {
  /**
   * @author Craig
   * @version 1.0.0
   * @date    2018-03-08
   * @return  {null}   这是构造函数
   */
  constructor() {
    this.host = configObj.host
    // this.host = '219.223.192.110'
    this.hostBackup = configObj.hostBackup
    this.port = 10287
    // this.port = 10287
    /**
     * 新建一个socket
     * @type {net}
     */
    this._socket = new net.Socket()
    // 设置编码格式
    this._socket.setEncoding('utf8')
    // 禁用长连接
    this._socket.setKeepAlive(false)
    // 禁止Nagle算法，每次write立即发送
    // this._socket.setNoDelay(true)
    // 设置超时时间
    this._socket.setTimeout(2000)

    this._socket.connect(this.port, this.host)
    let that = this
    this._socket.on('timeout', () => {
      that._socket.end()
      that._socket = new net.Socket()
      // 设置编码格式
      that._socket.setEncoding('utf8')
      // 禁用长连接
      that._socket.setKeepAlive(false)
      // 禁止Nagle算法，每次write立即发送
      // that._socket.setNoDelay(true)
      // 设置超时时间
      that._socket.setTimeout(2000)
      that._socket.connect(that.port, that.hostBackup)
      that._socket.on('timeout', () => {
        that._socket.end()
      })
    })
    this._socket.on('error', () => {
      that._socket.end()
      that._socket = new net.Socket()
      // 设置编码格式
      that._socket.setEncoding('utf8')
      // 禁用长连接
      that._socket.setKeepAlive(false)
      // 禁止Nagle算法，每次write立即发送
      // that._socket.setNoDelay(true)
      // 设置超时时间
      that._socket.setTimeout(2000)
      that._socket.connect(that.port, that.hostBackup)
      that._socket.on('timeout', () => {
        that._socket.end()
      })
    })
  }
  /**
   * @author Craig
   * @version 1.0.0
   * @date    2018-03-08
   * @param   {String}   data 需要发送的数据
   * @return  {null}        null
   */
  write(data) {
    const buf = Buffer.from(data)
    // 获取要传输的字符串长度
    let num = buf.length
    // 构建要生成buffer的数组，会往数组头部加4位数字
    let arr = []
    arr.push(num / 16581375)
    num = num % 16581375
    arr.push(num / 65025)
    num = num % 65025
    arr.push(num / 255)
    num = num % 255
    arr.push(num)
    let buf2 = Buffer.from(arr)
    let buf3 = Buffer.concat([buf2, buf])
    this._socket.write(buf3)
  }
  /**
   * @author Craig
   * @version 1.0.0
   * @date    2018-03-08
   * @return  {Promise}   返回一个Promise，需要resolve读取的结果
   * @description 因为是短连接，所以读完数据就关闭连接
   */
  read() {
    let that = this
    let str = ''
    return new Promise((resolve, reject) => {
      that._socket.on('data', data => {
        str += data
        //str=str.slice(4,-2)
      })
      that._socket.on('error', error => {
        that._socket.end()
        console.log("error:", error);
        reject(error)
      })
      that._socket.on('end', () => {
        resolve(str.slice(4))
      })
      // that._socket.on('timeout', () => {
      // 	console.log('socket timeout')
      // 	that._socket.end()
      // 	reject('连接超时，请重试')
      // })
    })
  }
}

export default Socket
