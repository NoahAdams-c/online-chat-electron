/**
 * @Description:
 * @Author: OBKoro1
 * @Date: 2019-10-25 13:45:59
 * @LastEditors: chenchen
 * @LastEditTime: 2020-03-09 11:37:55
 */
import Vue from "vue"
import Router from "vue-router"
// import Test from "@/components/test"
import Chat from "@/components/chat"
import Regist from "@/components/regist"
import Login from "@/components/login"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login
    },
    {
      path: "/chat/:user_id",
      name: "Chat",
      component: Chat,
      props: true
    },
    {
      path: "/regist",
      name: "Regist",
      component: Regist
    }
  ]
})
