import Vue from 'vue'
import Vuex from 'vuex'

//挂载Vuex
Vue.use(Vuex)

//创建Vuex对象
const store = new Vuex.Store({
    state:{
        username:'',
        cmIp:'http://219.223.193.51:10286',
        isLogged:false
    },
    mutations:{
        loginaction(state,payload){
            state.username = payload;
            state.isLogged = true
        },
        logoutaction(state){
            state.username = '';
            state.isLogged = false;
        }
    },
    actions:{
        loginAct(context,payload){
            context.commit('loginaction',payload)
        },
        logoutAct(context){
            context.commit('logoutaction')
        }
    }
})


export default store