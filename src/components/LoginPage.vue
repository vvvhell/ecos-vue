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

//import Socket from './api/socket'
import '../api/login'
import { getAesKey, encrypt, decrypt, aesEncrypt, aesDecrypt, rsaEncrypt, rsaDecrypt } from '../api/login';

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
    var qrcontent = "123"; //二维码内容


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

      cmKey:'',
      rsaKey:'',
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
            content: qrcontent,
            background: "#fff",
            color: "#000",
            width: 250,
            height: 250
          }
        ]
      }
    };
  },
  // mounted() {
  //    this.$axios.post('',this.msg)
  //    .then(response => (this.info = response))
  //    .catch(function(error) {
  //        // 请求失败处理
  //        console.log(error);

  //      });
  //  },
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

        var loginReq = {
          type:202,
          username:''
        }
        loginReq.username = this.$data.loginForm.username;

        var test = getAesKey(loginReq)
        console.log(test)

        

        this.$axios({
          method:'post',
          url:'http://219.223.198.230:10286',
          data:test
        })
        .then((response) =>{
          //let obj = '';
          //obj += response;
          //let AesKey = obj.slice(4);
          console.log("response");
          console.log(response);
          //console.log("if is JSON"+ JSON.parse(AesKey));
          //return AesKey;
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



        setTimeout(() => {
          this.loginFormVisible = true;
        }, 1000);
      } else {


        this.$router.push({path:'/Console'})



        this.$notify({
          title: "温馨提示",
          message: "请填写正确的登录信息",
          duration: 5000,
          offset: 50,
          type: "warning"
        });
        
        var text = "this is a test message";
        var enc = rsaEncrypt(text);
        console.log(enc);
        var msg = rsaDecrypt(enc);
        console.log(msg);

        this.$data.cmKey = getAesKey(enc);
        console.log(this.$data.cmKey);




      }
    },
    handleCompleteLogin() {
      this.loginFormVisible = false;
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
