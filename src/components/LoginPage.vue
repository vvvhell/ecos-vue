<template>
  <div id="app">
    <div class="title">
      <span>ECOS | 拟态对象存储</span>
    </div>
    <el-divider ></el-divider>

    <el-main id="body">
      <div class="background">
        <img src="../assets/background.jpg" style="height: 81vh" />
      </div>
      <div class="card">
        <el-card>
          <div style="font-size:20px">用户登录</div>
          <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" class="login">
            <el-form-item label="用户名" prop="username">
              <el-input type="text" v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
              <el-input type="password" v-model="loginForm.pass" autocomplete="off"></el-input>
            </el-form-item>
            <br />
            <el-checkbox style="padding-left:0px" v-model="agreed1">
              我已阅读并同意
              <el-link type="primary">《拟态对象存储服务协议》</el-link>
            </el-checkbox>
            <el-form-item>
              <br />
              <div style="text-align: center">
                <el-button type="primary" @click="handleLogin">登 录</el-button>
                <el-button @click="registerFormVisible = true">注 册</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </el-main>

    <div id="footer">
      <el-container>
        <el-footer>北京大学•深圳研究生院</el-footer>
      </el-container>
    </div>

    <el-dialog title="用户注册" width="28%" :visible.sync="registerFormVisible">
      <div style="height:460px">
        <el-steps :active="1" align-center>
          <el-step title="填写注册信息" icon="el-icon-edit"></el-step>
          <el-step title="身份信息采集" icon="el-icon-upload"></el-step>
        </el-steps>
        <el-form :model="regForm" status-icon :rules="rules" ref="regForm" class="regForm">
          <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="regForm.username"></el-input>
          </el-form-item>
          <p />
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="regForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <p />
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="regForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <p />
          <el-form-item label="邮箱" prop="email">
            <el-input type="text" v-model="regForm.email" autocomplete="off"></el-input>
          </el-form-item>
          <p />
        </el-form>
        <el-checkbox v-model="agreed2">
          我已阅读并同意
          <el-link type="primary">《拟态对象存储服务协议》</el-link>
        </el-checkbox>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="registerFormVisible = false">返 回</el-button>
        <el-button type="primary" @click="handleRegUserInfo">提交并进行身份信息采集</el-button>
      </div>
    </el-dialog>

    <el-dialog title="身份信息采集" width="28%" :visible.sync="registerForm2Visible" append-to-body>
      <div style="height:540px">
        <el-steps :active="2" align-center>
          <el-step title="填写注册信息" icon="el-icon-edit"></el-step>
          <el-step title="身份信息采集" icon="el-icon-upload"></el-step>
        </el-steps>
        <br />
        <vue-canvas-poster id="qrcode" :painting="painting" @success="success" append-to-body></vue-canvas-poster>
        <div style="padding:175px"></div>
        <div style="text-align: center">请使用手机app扫码</div>
        <br />
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button @click="registerForm2Visible = false">取 消</el-button>
          <el-button type="primary" @click="handleCompleteReg">完成身份信息采集</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="身份信息验证" width="28%" :visible.sync="loginFormVisible" append-to-body>
      <div style="height:540px">
        <el-steps :active="2" align-center>
          <el-step title="填写登录信息" icon="el-icon-edit"></el-step>
          <el-step title="身份信息验证" icon="el-icon-upload"></el-step>
        </el-steps>
        <br />
        <vue-canvas-poster id="qrcode" :painting="painting" @success="success" append-to-body></vue-canvas-poster>
        <div style="padding:175px"></div>
        <div style="text-align: center">请使用手机app扫码</div>
        <br />
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button @click="loginFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleCompleteLogin">完成身份信息验证</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { JSEncrypt } from 'jsencrypt/bin/jsencrypt';
import '../api/login'
import { getAesKey, encrypt, decrypt, aesEncrypt, aesDecrypt, rsaEncrypt, rsaDecrypt, utf16ToUtf8 } from '../api/login';

export default {
  data() {
    var isUsernameChecked = false;
    var checkUsername = (rule, value, callback) => {
      if (!value) {
        this.isUsernameChecked = false;
        return callback(new Error("用户名不能为空"));
      }
      setTimeout(() => {
        if ((value.length < 6) | (value.length > 15)) {
          this.isUsernameChecked = false;
          callback(new Error("用户名长度必须为6位-15位"));
        } else if (value.search(/^[a-zA-Z0-9][a-zA-Z0-9_]{5,15}$/) != -1) {
          this.isUsernameChecked = true;
          callback();
        } else {
          this.isUsernameChecked = false;
          callback(new Error("用户名只能包含字母数字或下划线"));
        }
      }, 500);
    };
    var isPassChecked = false;
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        this.isPassChecked = false;
        callback(new Error("请输入密码"));
      } else if ((value.length < 6) | (value.length > 15)) {
        this.isPassChecked = false;
        callback(new Error("密码长度必须为6位-15位"));
      } else {
        if (this.regForm.checkPass !== "") {
          this.$refs.regForm.validateField("checkPass");
        }
        this.isPassChecked = true;
        callback();
      }
    };
    var isPassChecked2 = false;
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        this.isPassChecked2 = false;
        callback(new Error("请再次输入密码"));
      } else if (value !== this.regForm.pass) {
        this.isPassChecked2 = false;
        callback(new Error("两次输入密码不一致!"));
      } else {
        this.isPassChecked2 = true;
        callback();
      }
    };
    var isEmailChecked = false;
    var checkEmail = (rule, value, callback) => {
      if (!value) {
        this.isEmailChecked = false;
        callback(new Error("邮箱不能为空"));
      }
      setTimeout(() => {
        if (
          value.search(
            /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
          ) != -1
        ) {
          this.isEmailChecked = true;
          callback();
        } else {
          this.isEmailChecked = false;
          callback(new Error("请输入正确的邮箱格式"));
        }
      }, 500);
    };


    return {
      regForm: {
        type:1,
        username: "",
        pass: "",
        checkPass: "",
        email: ""
      },
      loginForm: {
        type:2,
        username: "",
        pass: ""
      },
      
      rules: {
        username: [{ validator: checkUsername, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        email: [{ validator: checkEmail, trigger: "blur" }]
      },

      aesKey:'',
      loginFormVisible: false,
      registerFormVisible: false,
      registerForm2Visible: false,
      agreed1: false,
      agreed2: false,
      painting: {
        //二维码参数
        width: 250,
        height: 250,
        views: [
          {
            type: "qrcode",
            content: "",
            background: "#fff",
            color: "#000",
            width: 250,
            height: 250
          }
        ]
      }
    };
  },

  methods: {

    handleLogin() {
      if (this.isUsernameChecked && this.isPassChecked && this.agreed1) {
        this.$notify({
          title: "温馨提示",
          message: "请扫码验证身份信息！",
          duration: 5000,
          offset: 50,
          type: "success"
        });

        //获取aesKey
        //获取aesKey的请求格式
        var loginReq = {
          type:202,
          username:''
        }
        loginReq.username = this.$data.loginForm.username;
        var Req = getAesKey(loginReq)
        //发送获取aesKey请求
        this.$axios({
          method:'post',
          url:'http://222.29.25.20:10286',
          data:Req
        })
        .then((response) =>{
          console.log("response: ");
          console.log(response);
          //解密获取aesKey
          var str = "";
          str = response.data.cmKey;
          console.log("str", str);
          let jse = new JSEncrypt();
          const privateKey = "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCUXE1H9n+uRZWxKU0jpRq1blVNyxpx/6lX4GzUErPoLa9sgxF8GU//6xwcqfq+ngFwL51Z07Tt9I8Tm41wSTHBj20f9zOJvWYCodULhAuxwUUeWjnlBCgPUlCJvhIHfV01+sFJBlsogs+BfV9jSYNEphpQLAY/PBuSmObBmGFlzeg0fKCxgTAQMBd0qSO30Co0aOE7TQhjae6OvNFrd6HlHhnhKf6e05wjPyWnb7CtBKDUOGTHimqcp2K8RyN3poiZSsVgYIUoAeLrXKk3bO/8OZd+pyPSiZ/JvOnIoJ6ZZSrUB30fAltaSWYZoytG/rUPX2lO5QRr0AlXmPMbV9WBAgMBAAECggEAAe0s57lQsR+gMPu7T7IuJZr4Kplvj3llZom4gAx6H5KwS3VsPbNKcaVI6Spf4ifFFwLXRTpViB172iJT9NhOeBf3r8mS9r/p2jDlxk+Bo15CGoHLbKjgKErGVvOL4mMDWdcWuW8GsgD41tKc8Xob5UFO6CmaLyoFpaKspGjpItxDjPw6cd0r6fJ5Di3SdgZ9+DizTGzoOWl9H9kDpbhnqkLiyrwjEjXOmAzO7pDWh0QATV2/DE2KjVtbmZKSlI4MIyKAv2lf997lQ7iVtgXJ37vGab+oPRIg2jjAHaJJgkvL49OejJX2LYKKQsMUDZS3Ma6t/S5mk0SNb0ysQSQ/QQKBgQDN7UsUp/YA4f7sdwvE9C3iWj14Kv1Es3pNuP0DBYWK4gX8aUima8XKbvHZ8Y8RxnsFkZd4CQU/MaY/yRI5KVMyS1sianIWtTWShkrjO6INYl7E28YJcQYBxdByAUCgL9wdwlQkbuUjsrl+XrsCUlcp9XV5orYctn40jO5XwuOjaQKBgQC4b5H7UFo3kVjgMMqaEnaptKqAfXLD5F2RZEwkNmZkbIRlLZk0mRHJ7QlQtj9Z+yKN6d8SCAthS7739A6qMUH7ZrY2/bdEQmgZdaj1B6zVgjIEak20Lt2WFrG0uuuIUHmnNCRXuUk1aCxm4x12EZpf9sFsjkjZXlfv6QRi2MEWWQKBgQDKc6Nf8G0TmxvUAInqnSFLKurJ7IHI/CaeqOLeCJys2N+Hsz6Alu4CwiY13Z2JnTevVt6yXTPyV+6ZQSYQWod3p8w2Pq5hks/TeQHA+wyr2e1P3r2I5LxCG+d9XavakJL4EuhEVV4jRX/GNH3on2kgUDipWAVwnx3erjtYvrqsGQKBgDgzNyZ/S55XGd/mvjXInoQD21if4VKzyZc+Gr2GHhlHv+gcxuxyICuJoScJAbDnh5X6x9B0xxL0w9JGehl+PP7gQ3HqSefw3Eu1wLA5kH7W12rlAZyAE2FitO+/bXnyG7/JcbGRci9l+PG5DwclQgcv56yuhqBF0UH3nTCJn/yxAoGBAIDJJtaVBPNCZ4KkIMg/TRdMwEAqJuKVBzYn/xsNNTJlmp9XX9EsNlH590xz8KlqNpLkNJJYsy/Jk4EVEUfV2IovhGkUrIcmLb5UbTCItO2arpHh/6wne9iA5CnmZREyfLUpnueg0V2TKQwmdjGqN9U5RpVE1+H2TPfUJ4j+53Hv"
          jse.setPrivateKey(privateKey);
          var a = "";
          a = jse.decrypt(str);
          console.log("a", a);
          // this.$data.aesKey = jiemi;
          // console.log(this.$data.aesKey);
            

        }).catch((error) =>{ 
          console.log(error);   
          this.$message({
            showClose:true,
            message:error,
            type:'error',
            duration:0
        })
    })
        //getAesKey(loginReq);
        //console.log(enc);
        //this.$data.cmKey = rsaDecrypt(enc);
        //var encloginForm = aesEncrypt(this.$data.loginForm, this.$data.cmKey)



        //var text = this.$data.loginForm;
        //console.log(text);
        //var a= aesEncrypt(text , '1234567890123456');
        //console.log(a);
        //var b= aesDecrypt(a , '1234567890123456');
        //console.log(b);
        //this.$data.info = JSON.parse(b);
        //console.log(this.$data.info);
        //console.log(this.$data.loginForm)
        
        //设置二维码中的内容
        // var qrcontent = {
        //   cmIp:"222.29.67.129:10286",
        //   cmKey:""
        // };
        // qrcontent.cmKey = this.$data.aesKey;
        // this.$data.painting.views[0].content = JSON.stringify(qrcontent);
        // console.log(this.$data.painting.views[0].content);


        setTimeout(() => {
          this.loginFormVisible = true;
        }, 1000);

      } else {
        this.$notify({
          title: "温馨提示",
          message: "请填写正确的登录信息",
          duration: 5000,
          offset: 50,
          type: "warning"
        });  

        var str = "jenUGhFePcGAIjGvIvwj/JtYyczYWhvvkIe+Sdsuc9FtlByptxXHgjyHhKXUe3LGQbXBXRXu1yBhvPiSjplcy5ripUL9Nd1DFbbQLAB9YjRyq/WDQlYq8GL6P1G+sbBI0i7xM8YF9VtYylJHSZksdsenFaohGuY7Sm3wHZg22+kT/Dp2gsLTc3aMYmrMW9RZrhfRxI5PsG+BmItxRsi1vtXHjOGcyIDsqoLwZungTSf1NBqBp/vZ6QD3z53DDBIfTC6hNkiZ/xfdxtZs3jNPPnl3BNrA7JnMqt5uZSqWZk6TrYIkD6NHwffBKrAoYG79KPLobxTM6GrtfgyZ2ZaPiw==";
        var jiemi = rsaDecrypt(str);
        console.log(jiemi);

      }
    },
    handleCompleteLogin() {
      this.loginFormVisible = false;
      this.$router.push({path:'/Console'});
    },
    handleRegUserInfo() {
      if (
        this.isUsernameChecked &&
        this.isPassChecked &&
        this.isPassChecked2 &&
        this.isEmailChecked &&
        this.agreed2
      ) {
        this.$notify({
          title: "温馨提示",
          message: "提交成功，请扫码采集身份信息！",
          duration: 5000,
          offset: 50,
          type: "success"
        });
        setTimeout(() => {
          this.registerForm2Visible = true;
        }, 1000);
      } else {
        this.$notify({
          title: "温馨提示",
          message: "请按要求填写注册信息",
          duration: 5000,
          offset: 50,
          type: "warning"
        });
      }
    },
    handleCompleteReg() {
      this.registerFormVisible = false;
      this.registerForm2Visible = false;
      this.$notify({
        title: "温馨提示",
        message: "注册成功！",
        duration: 5000,
        offset: 50,
        type: "success"
      });
    },
    success() {
      console.log("generate qrcode success");
    },

  }
};
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
}
.title {
  font-size: xx-large;
  padding-top: 40px;
  padding-left: 120px;
}
.background {
  position: absolute;
  z-index: 1;
}
.card {
  position: absolute;
  padding-top: 10vh;
  padding-left: 60vw;
  z-index: 3;
}
.el-main {
  padding-bottom: 75vh;
}
.el-card {
  width: 25vw;
}
.login {
  text-align: left;
  padding-top: 40px;
}

canvas.canvas[data-v-39d61408] {
  position: absolute;
  top: 32%;
  left: 25%;
}
.el-button,
.el-input__inner,
.el-card,
.el-dialog {
  border-radius: 0;
}
.el-footer {
  background-color: rgb(236, 239, 243);
  color: #333;
  text-align: center;
  line-height: 60px;
  width: 99vw;
  z-index: 2;
}
</style>
