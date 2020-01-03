/**
 * @Description:
 * @Author: chenchen
 * @Date: 2019-10-29 17:01:18
 * @LastEditors: chenchen
 * @LastEditTime: 2019-10-29 18:15:27
 */
import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false,
    userInfo: {},
    socketObj: null,
    onlineUsers: []
  },
  mutations: {
    updateSocket(state, socketObj) {
      state.socketObj = socketObj
    },
    updateOnlineUsers(state, onlineUsers) {
      state.onlineUsers = onlineUsers
    },
    updateUserInfo(state, userInfo) {
      state.userInfo = userInfo
      state.isLogin = !!userInfo
    }
  },
  getters: {
    getSocket(state) {
      return state.socketObj
    },
    getOnlineUsers(state) {
      return state.onlineUsers
    },
    getUserInfo(state) {
      return state.userInfo
    },
    getLoginStatus(state) {
      return state.isLogin
    }
  }
})
