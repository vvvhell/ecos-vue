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
      <div class="logincard">
        <el-card>
          <div style="font-size:20px">用户登录</div>
          <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" class="loginform">
            <el-form-item class="form-item" prop="mobilenumber">
              <span class="label">手机号码</span>
              <el-input type="text" v-model="loginForm.mobilenumber" autocomplete="off" style="width:45%"></el-input>
              <el-button type="primary" plain style="margin-left:8px" @click="sendSMS(loginForm)">发送验证码</el-button>
            </el-form-item>
            <el-form-item class="form-item" prop="SMScode">
              <span class="label">验证码</span>
              <el-input class="cardinput" type="text" v-model="loginForm.SMScode" autocomplete="off"></el-input>
            </el-form-item>
            <br />
            <el-checkbox class="checkbox" v-model="agreed1">
              我已阅读并同意
              <el-link type="primary">《拟态对象存储服务协议》</el-link>
            </el-checkbox>
            <el-form-item>
              <br />
              <div style="text-align:center">
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

    <el-dialog title="用户注册" width="28%" class="regform" :visible.sync="registerFormVisible">
      <div style="margin-top:30px">
        <el-form :model="regForm" status-icon :rules="rules" ref="regForm">
          <el-form-item class="form-item" prop="mobilenumber">
            <span class="label">手机号码</span>
            <el-input type="text" v-model="regForm.mobilenumber" autocomplete="off" style="width:45%"></el-input>
            <el-button type="primary" plain style="margin-left:8px" @click="sendSMS(regForm)">发送验证码</el-button>
          </el-form-item>
          <el-form-item class="form-item" prop="SMScode">
            <span class="label">验证码</span>
            <el-input class="cardinput" type="text" v-model="regForm.SMScode" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <el-checkbox class="checkbox" v-model="agreed2">
          我已阅读并同意
          <el-link type="primary">《拟态对象存储服务协议》</el-link>
        </el-checkbox>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button @click="registerFormVisible = false">返 回</el-button>
        <el-button type="primary" @click="handleRegUserInfo" style="margin-bottom:20px">提交注册信息</el-button>
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
    var isMobileNumChecked = false;
    var checkMobileNum = (rule, value, callback) => {
      if (!value) {
        this.isMobileNumChecked = false;
        return callback(new Error("手机号码不能为空"));
      }
      setTimeout(() => {
        if (value.length > 11) {
          this.isMobileNumChecked = false;
          callback(new Error("手机号码长度不正确"));
        } else if (value.search(/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/) != -1) {
          this.isMobileNumChecked = true;
          callback();
        } else {
          this.isMobileNumChecked = false;
          callback(new Error("请输入有效的手机号码"));
        }
      }, 500);
    };
    var isSMScodeChecked = false;
    var checkSMScode = (rule, value, callback) => {
      if (!value) {
        this.isSMScodeChecked = false;
        callback(new Error("短信验证码不能为空"));
      }else{
        this.isSMScodeChecked = true;
        callback();
      }
    };

    return {
      regForm: {
        mobilenumber: "",
        SMScode:""
      },
      loginForm: {
        mobilenumber: "",
        SMScode:""
      },
      
      rules: {
        mobilenumber: [{ validator: checkMobileNum, trigger: "change" }],
        SMScode: [{ validator: checkSMScode, trigger: "blur" }]
      },

      aesKey:'',
      registerFormVisible: false,
      agreed1: false,
      agreed2: false,
    };
  },

  mounted(){
  },

  methods: {

    //获取手机短信验证码
    sendSMS(form){
      if (this.isMobileNumChecked) {
        //获取aesKey
        //获取aesKey的请求格式
        var getkeyReq = {
          type:202,
          username:''
        };
        getkeyReq.username = "+86"+form.mobilenumber;
        console.log(getkeyReq.username);
        var logReq1 = transData(getkeyReq);
        //发送获取aesKey请求
        this.$axios({
          method:'post',
          url:store.state.cmIp,
          data:logReq1
        })
        .then((response) =>{
          console.log("Keyresponse", response);
          //解密获取aesKey
          var str = "";
          str = response.data.cmKey;
          console.log("str", str);
          this.$data.aesKey = rsaDecrypt(str);
          if(response.data.state == "0"){
            var webContent = {
              type:204,
              mobilenumber:''
            };
            webContent.mobilenumber = "+86"+form.mobilenumber;
            var SMSReq = transData(webContent);
            this.$axios({
              method:'post',
              url:store.state.cmIp,
              data:SMSReq
            })
            .then((response)=>{
              console.log("SMSresponse",response)
              if(response.data.state == "1"){
                this.$message({
                  showClose:true,
                  message:response.data.errorMessage,
                  type:'error',
                  duration:3000
                })               
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
          }else{
            this.$message({
              showClose:true,
              message:response.data.errorMessage,
              type:'error',
              duration:3000
            })            
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
      }
    },
    //处理登录流程
    handleLogin() {
      if (this.isMobileNumChecked && this.isSMScodeChecked && this.agreed1) {
        var webContent = {
          type:132,
          mobilenumber:"+86"+this.$data.loginForm.mobilenumber,
          SMSnumber:this.$data.loginForm.SMScode
        }
        var enc = aesEncrypt(webContent, this.$data.aesKey);
        var loginReq = {
            type:132,
            mobilenumber:"+86"+this.$data.loginForm.mobilenumber,
            keyYongHu:''
        }
        loginReq.keyYongHu = enc;
        var logReq = transData(loginReq);
        this.$axios({
          method:'post',
          url:store.state.cmIp,
          data:logReq
        })
        .then((response) =>{
          console.log("loginresponse",response);
          //收到CM对登录请求的响应
          if(response.data.state == "1"){
            this.$message({
              showClose:true,
              message:response.data.errorMessage,
              type:'error',
              duration:3000
            })
            if(response.data.errorMessage=="手机验证码错误，无法登录"){
              this.$data.loginForm.SMScode = ""
            }   
          }else{
            this.handleCompleteLogin();
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
    //完成登录
    handleCompleteLogin() {
      this.loginFormVisible = false;
      this.$router.replace({path:'/Console/'+store.state.username});
    },
    //处理注册流程
    handleRegUserInfo() {
      if (this.isMobileNumChecked && this.isSMScodeChecked && this.agreed2) {
        var webContent = {
          type:131,
          mobilenumber:"+86"+this.$data.regForm.mobilenumber,
          SMSnumber:this.$data.regForm.SMScode
        }
        var enc = aesEncrypt(webContent, this.$data.aesKey);
        var registReq = {
            type:131,
            mobilenumber:"+86"+this.$data.regForm.mobilenumber,
            keyYongHu:''
        }
        registReq.keyYongHu = enc;
        var regReq = transData(registReq);
        this.$axios({
          method:'post',
          url:store.state.cmIp,
          data:regReq
        })
        .then((response) =>{
          console.log("registresponse",response);
          //收到CM对注册请求的响应
          if(response.data.state == "1"){
            this.$message({
              showClose:true,
              message:response.data.errorMessage,
              type:'error',
              duration:3000
            });
            if(response.data.errorMessage == "手机验证码错误，无法注册"){
              this.$data.regForm.SMScode = ""
            }else if(response.data.errorMessage == "用户已存在，无法重复注册"){
              this.$data.regForm.mobilenumber = "",
              this.$data.regForm.SMScode = ""
            }   
          }else{
            this.handleCompleteReg();
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
    //完成注册
    handleCompleteReg() {
      this.registerFormVisible = false;
      this.$notify({
        title: "温馨提示",
        message: "注册成功！",
        duration: 5000,
        offset: 50,
        type: "success"
      });
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
#body {
  padding-bottom: 75vh;
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

.logincard {
  position: absolute;
  padding-top: 18vh;
  padding-left: 35vw;
  z-index: 3;
  width: 28%;
}
.loginform {
  text-align: left;
  padding-top: 40px;
}
.form-item {
  margin-bottom: 40px;
}
.label{
  display: inline-block;
  text-align: left;
  width: 70px;
  padding-left: 30px;
}
.cardinput {
  width: 70%;
}
.checkbox {
  padding-left: 30px;
}

.regform {
  padding-top: 18vh;
}

.el-footer {
  background-color: rgb(236, 239, 243);
  color: #333;
  text-align: center;
  line-height: 60px;
  width: 100%;
  z-index: 2;
}

.el-button,
.el-input__inner,
.el-card,
.el-dialog {
  border-radius: 0;
}
</style>
