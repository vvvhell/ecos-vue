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
        <el-card class="logincard">
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
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import router from 'vue-router'
import store from '../store'
import { transData, rsaDecrypt, aesEncrypt } from '../api/encrypt';

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
      } else if ((value.length < 8) | (value.length > 15)) {
        this.isPassChecked = false;
        callback(new Error("密码长度必须为8位-15位"));
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
      painting:{}
    };
  },

  mounted(){
  },

  methods: {

    //登录流程
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
        var getkeyReq = {
          type:202,
          username:''
        };
        getkeyReq.username = this.$data.loginForm.username;
        var logReq1 = transData(getkeyReq);
        //aesEncrypt();
        //发送获取aesKey请求
        this.$axios({
          method:'post',
          url:store.state.cmIp,
          data:logReq1
        })
        .then((response) =>{
          console.log("response: ", response);
          if(response.data.state == "1"){
            this.$message({
              showClose:true,
              message:response.data.errorMessage,
              type:'error',
              duration:3000
            })               
          }else if(response.data.state == "0"){
            //解密获取aesKey
            var str = "";
            str = response.data.cmKey;
            console.log("str", str);         
            //设置二维码中的内容
            var qrcontent = {
              CMip:"",
              AESkey:"",
              Username:"",
              Flag:1
            };
            qrcontent.Username = this.$data.loginForm.username;
            var ipstr = store.state.cmIp.slice(7);
            var iparr = ipstr.split(":");
            qrcontent.CMip = iparr[0];
            qrcontent.AESkey = rsaDecrypt(str);
            this.$data.painting = {
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
            this.$data.painting.views[0].content = JSON.stringify(qrcontent);
            console.log(this.$data.painting.views[0].content);
            this.$data.aesKey = qrcontent.AESkey
          }         
        })
        .catch((error) =>{
          this.$message({
            showClose:true,
            message:error,
            type:'error',
            duration:3000
          })
        })
        //发送登录请求
        .then(()=>{
          var webContent = {
            type:115,
            username:this.$data.loginForm.username,
            password:this.$data.loginForm.pass
          };
          var enc = aesEncrypt(webContent, this.$data.aesKey);
          var loginReq = {
              type:115,
              username:'',
              keyyonghu:''
          }
          loginReq.username = this.$data.loginForm.username;
          loginReq.keyyonghu = enc;
          var logReq2 = transData(loginReq);
          this.$axios({
            method:'post',
            url:store.state.cmIp,
            data:logReq2
          })
          .then((response) =>{
            console.log("response",response);
            //收到CM对登录请求的响应
            if(response.data.state == "1"){
              this.$message({
                showClose:true,
                message:response.data.errorMessage,
                type:'error',
                duration:3000
              })
              if(response.data.errorMessage=="用户不存在! "){
                this.$data.loginForm.username = ''
              }else if(response.data.errorMessage=="密码错误! "){
                this.$data.loginForm.pass = ''
              }               
            }else if(response.data.state == "0"){
              console.log("轮询");
              var confirm = {
                type:118,
                username:this.$data.loginForm.username
              };
              var logReq3 = transData(confirm);
              //轮询接收CM确认信息

              var Confirm = (()=>{

                this.$axios({
                  method:'post',
                  url:store.state.cmIp,
                  data:logReq3
                })
                .then((response)=>{
                  console.log("confirm",response);
                  this.handleCompleteLogin(this.$data.loginForm.username)
                })
                //未收到确认信息则递归重新请求
                .catch((error)=>{
                  console.log("error",error);
                  setTimeout(()=>{
                    Confirm();
                  },5000)                    
                })
              })
              Confirm();
            }else{
              this.$message({
                showClose:true,
                message:response.errorMessage,
                type:'error',
                duration:3000
              })
            }
          })  
        })
        .catch((error) =>{ 
          console.log(error);   
          this.$message({
            showClose:true,
            message:error,
            type:'error',
            duration:3000
          })
        })

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

      }
    },
    handleCompleteLogin(data) {
      this.loginFormVisible = false;
      this.$store.dispatch('loginAct',data);
      console.log(this.$route);
      this.$router.replace({path:'/Console/'+this.$store.state.username});
      console.log(this.$route);      
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
        //获取aesKey
        //获取aesKey的请求格式
        var getkeyReq = {
          type:202,
          username:''
        };
        getkeyReq.username = this.$data.regForm.username;
        var regReq1 = transData(getkeyReq);
        //aesEncrypt();
        //发送获取aesKey请求
        this.$axios({
          method:'post',
          url:store.state.cmIp,
          data:regReq1
        })
        .then((response) =>{
          console.log("response: ", response);
          if(response.data.state == "1"){
            this.$message({
              showClose:true,
              message:response.data.errorMessage,
              type:'error',
              duration:3000
            })               
          }else if(response.data.state == "0"){
            //解密获取aesKey
            var str = "";
            str = response.data.cmKey;
            console.log("str", str);         
            //设置二维码中的内容
            var qrcontent = {
              CMip:"",
              AESkey:"",
              Username:"",
              Flag:0
            };
            qrcontent.Username = this.$data.regForm.username;
            var ipstr = store.state.cmIp.slice(7);
            var iparr = ipstr.split(":");
            qrcontent.CMip = iparr[0];
            qrcontent.AESkey = rsaDecrypt(str);
            this.$data.painting = {
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
            this.$data.painting.views[0].content = JSON.stringify(qrcontent);
            console.log(this.$data.painting.views[0].content);
            this.$data.aesKey = qrcontent.AESkey            
          }

        })
        .catch((error) =>{ 
          console.log(error);   
          this.$message({
            showClose:true,
            message:error,
            type:'error',
            duration:3000
          })
        })
        //发送注册请求
        .then(()=>{
          var webContent = {
            type:111,
            username:this.$data.regForm.username,
            password:this.$data.regForm.pass,
            email:this.$data.regForm.email
          };
          var enc = aesEncrypt(webContent, this.$data.aesKey);
          var regReq = {
              type:111,
              username:'',
              keyYongHu:''
          }
          regReq.username = this.$data.regForm.username;
          regReq.keyYongHu = enc;
          var regReq2 = transData(regReq);
          this.$axios({
            method:'post',
            url:store.state.cmIp,
            data:regReq2
          })
          .then((response) =>{
            console.log("response",response);
            //收到CM对注册请求的响应
            if(response.data.state == "1"){
              this.$message({
                showClose:true,
                message:response.data.errorMessage,
                type:'error',
                duration:3000
              });
              if(response.data.errorMessage == "用户已存在! "){
                this.$data.regForm.username = "",
                this.$data.regForm.pass = "",
                this.$data.regForm.checkPass = ""
              }   
            }else{
              console.log("轮询");
              var confirm = {
                type:114,
                username:this.$data.regForm.username
              };
              var regReq3 = transData(confirm);
              //轮询接收CM确认信息
              var Confirm = (()=>{
                this.$axios({
                  method:'post',
                  url:store.state.cmIp,
                  data:regReq3
                })
                .then((response)=>{
                  console.log("confirm",response);
                  this.handleCompleteReg();
                })
                //未收到确认信息则递归重新请求
                .catch((error)=>{
                  console.log("error",error);
                  setTimeout(()=>{
                    Confirm();
                  },5000)                    
                })
              })
              Confirm();
            }
          })
          .catch((error) =>{ 
            console.log(error);   
            this.$message({
              showClose:true,
              message:error,
              type:'error',
              duration:3000
            })
          })        
        })
        .catch((error) =>{ 
          console.log(error);   
          this.$message({
            showClose:true,
            message:error,
            type:'error',
            duration:3000
          })
        })

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
*{
  padding: 0;
  margin: 0;
}
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
  overflow: hidden;
  z-index: 1;
}
.card {
  position: absolute;
  padding-top: 10vh;
  padding-left: 60vw;
  z-index: 3;
}
#body {
  padding-bottom: 75vh;
}
.logincard {
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
  width: 100%;
  z-index: 2;
}
</style>
