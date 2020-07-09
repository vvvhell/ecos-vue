import Vue from 'vue'
import Vuex from 'vuex'

//挂载Vuex
Vue.use(Vuex)

//创建Vuex对象
const store = new Vuex.Store({
    state:{
        username:'',
        cmIp:'http://219.223.193.21:10286',
        interfaceIp:'http://219.223.193.104:8082',
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
        },
        changecm(state,payload){
            state.cmIp = 'http://'+payload+':10286'
        },
        changeinterface(state,payload){
            state.interfaceIp = 'http://'+payload+':8082'
        }
    },
    actions:{
        loginAct(context,payload){
            context.commit('loginaction',payload)
        },
        logoutAct(context){
            context.commit('logoutaction')
        },
        changecmIp(context,payload){
            context.commit('changecm',payload)
        },
        changeinterfaceIp(context,payload){
            context.commit('changeinterface',payload)
        },
    }
})


export default store