<template>
  <div id="app">
    <div class="title">
      <div style="display:inline-block"><span>ECOS | 拟态对象存储</span></div>
      <el-button type="info" id="config" icon="el-icon-s-tools" @click="configVisible = true">修改配置</el-button>
    </div>
    <el-divider ></el-divider>

    <el-main id="body">
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

    <el-dialog title="用户注册" width="600px" :visible.sync="registerFormVisible">
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

    <el-dialog title="身份信息采集" width="600px" :visible.sync="registerForm2Visible" append-to-body>
      <div style="height:540px">
        <el-steps :active="2" align-center>
          <el-step title="填写注册信息" icon="el-icon-edit"></el-step>
          <el-step title="身份信息采集" icon="el-icon-upload"></el-step>
        </el-steps>
        <br />
        <vue-canvas-poster id="qrcode" :painting="painting" append-to-body></vue-canvas-poster>
        <div style="padding:175px"></div>
        <div style="text-align: center">请使用手机app扫码</div>
        <br />
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button @click="returnReg()">取 消</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="身份信息验证" width="600px" :visible.sync="loginFormVisible" append-to-body>
      <div style="height:540px">
        <el-steps :active="2" align-center>
          <el-step title="填写登录信息" icon="el-icon-edit"></el-step>
          <el-step title="身份信息验证" icon="el-icon-upload"></el-step>
        </el-steps>
        <br />
        <vue-canvas-poster id="qrcode" :painting="painting" append-to-body></vue-canvas-poster>
        <div style="padding:175px"></div>
        <div style="text-align: center">请使用手机app扫码</div>
        <br />
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button @click="returnLog()">取 消</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="修改配置信息" width="600px" :visible.sync="configVisible" append-to-body style="padding-top:130px">
      <el-form :model="configForm" status-icon ref="configForm">
        <el-form-item label="CM IP" prop="cmIp">
          <el-input type="text" v-model="configForm.cmIp"></el-input>
        </el-form-item>
        <p />
        <el-form-item label="Interface Server IP" prop="interfaceIp">
          <el-input type="text" v-model="configForm.interfaceIp"></el-input>
          </el-form-item>
          <p />
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="configVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeConfig()">确 定</el-button>
      </span>
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
      configForm: {
        cmIp:"",
        interfaceIp:""
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
      configVisible: false,
      agreed1: false,
      agreed2: false,
      painting:{},
      regPoll: false,
      logPoll: false,
    };
  },

  mounted(){
    function getCookie(cname){
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for(var i=0; i<ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
      }
      return "";
    }
    var cmIp = "cmIp";
    var interfaceIp = "interfaceIp";
    if(getCookie(cmIp) != ""){
      this.$store.dispatch('changecmIp', getCookie(cmIp));
    };
    if(getCookie(interfaceIp) != ""){
      this.$store.dispatch('changeinterfaceIp',getCookie(interfaceIp));
    }
  },

  methods: {

    //登录流程
    handleLogin() {
      if (this.isUsernameChecked && this.isPassChecked && this.agreed1) {
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
            this.$data.aesKey = rsaDecrypt(str)
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
            if(response.data.state === "1"){
              this.$message({
                showClose:true,
                message:response.data.errorMessage,
                type:'error',
                duration:3000
              })
              if(response.data.errorMessage=="用户不存在! "){
                this.$data.loginForm.username = '';
                return;
              }else if(response.data.errorMessage=="密码错误! "){
                this.$data.loginForm.pass = '';
                return;
              }
              return;               
            }else if(response.data.state === "0"){
              this.loginFormVisible = true;
              this.$notify({
                title: "温馨提示",
                message: "请扫码验证身份信息！",
                duration: 5000,
                offset: 50,
                type: "success"
              });
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
              qrcontent.AESkey = this.$data.aesKey;
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
              console.log("轮询");
              this.$data.logPoll = true;
              var confirm = {
                type:118,
                username:this.$data.loginForm.username
              };
              var logReq3 = transData(confirm);
              //轮询接收CM确认信息              
              this.Confirm(this.$data.logPoll, logReq3);
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
    //轮询登录信息
    Confirm(data, logReq3){
      if(data == true){
        this.$axios({
          method:'post',
          url:store.state.cmIp,
          data:logReq3
        })
        .then((response)=>{
          console.log("轮询结果",response.data);
          if(response.data.state == "0"){
            console.log("confirm",response);
            this.handleCompleteLogin(this.$data.loginForm.username)
          }else if(response.data.state == "1"){
            this.returnLog();
            this.$message({
              showClose:true,
              message:response.data.errorMessage,
              type:'error',
              duration:3000
            })
          }                 
        })
        //未收到确认信息则递归重新请求
        .catch((error)=>{
          console.log("error",error);
          if(this.logPoll == true){
            setTimeout(()=>{
              this.Confirm(this.logPoll, logReq3);
            },5000)    
          }                                 
        })
      }else{
        return;
      }

    },
    //返回登录界面
    returnLog(){
      this.loginFormVisible = false;
      this.logPoll = false;
    },
    //完成登录
    handleCompleteLogin(data) {
      this.loginFormVisible = false;
      this.$store.dispatch('loginAct',data);
      console.log(this.$route);
      this.$router.replace({path:'/Console/'+this.$store.state.username});
      console.log(this.$route);      
    },
    //注册流程
    handleRegUserInfo() {
      if (
        this.isUsernameChecked &&
        this.isPassChecked &&
        this.isPassChecked2 &&
        this.isEmailChecked &&
        this.agreed2
      ) {
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

            this.$data.aesKey = rsaDecrypt(str)            
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
              this.$notify({
                title: "温馨提示",
                message: "正在提交，请扫码采集身份信息！",
                duration: 5000,
                offset: 50,
                type: "success"
              });
              this.registerForm2Visible = true;
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
              qrcontent.AESkey = this.$data.aesKey;
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
              console.log("轮询");
              this.regPoll = true;
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
                  if(this.regPoll == true){
                    setTimeout(()=>{
                      Confirm();
                    },5000)  
                  }                                    
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
    //返回注册界面
    returnReg(){
      this.registerForm2Visible = false;
      this.regPoll = false;
    },
    //提交注册
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
    //修改配置
    changeConfig(){
      function setCookie(name,value){ 
        var Days = 30; 
        var exp = new Date(); 
        exp.setTime(exp.getTime() + Days*24*60*60*1000); 
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
        console.log(name,value); 
      }; 
      if(this.configForm.cmIp != ""){
        this.$store.dispatch('changecmIp',this.configForm.cmIp);
        document.cookie="cmIp="+this.configForm.cmIp;
      }
      if(this.configForm.interfaceIp != ""){
        this.$store.dispatch('changeinterfaceIp',this.configForm.interfaceIp);
        document.cookie="interfaceIp="+this.configForm.interfaceIp;
      }
      this.configVisible = false;
      console.log(this.configForm);
    }
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
  position: relative;
  font-size: xx-large;
  padding-top: 40px;
  padding-left: 120px;
}
#config {
  position:absolute;
  right:50px
}
.background {
  position: absolute;
  overflow: hidden;
  z-index: 1;
}
.card {
  position: absolute;
  padding-top: 10vh;
  margin-left: 36%;
  z-index: 3;
}
#body {
  background:url("../assets/background.jpg");
  background-size: cover;
  height: 80vh;
}
.logincard {
  width: 500px;
}
.login {
  text-align: left;
  padding-top: 40px;
}

canvas.canvas[data-v-39d61408] {
  position: absolute;
  top: 32%;
  left: 30%;
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
