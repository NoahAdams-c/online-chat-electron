/**
 * @Description:
 * @Author: OBKoro1
 * @Date: 2019-08-28 15:26:51
 * @LastEditors: chenchen
 * @LastEditTime: 2020-01-07 15:45:58
 */
import Vue from "vue"
import App from "./App"
import router from "./router"

// 引入elementUI
import {
  Button,
  Input,
  Card,
  Form,
  FormItem,
  Message,
  Container,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Loading,
  Upload
} from "element-ui"
Vue.component(Button.name, Button)
Vue.component(Input.name, Input)
Vue.component(Card.name, Card)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Container.name, Container)
Vue.component(Aside.name, Aside)
Vue.component(Main.name, Main)
Vue.component(Menu.name, Menu)
Vue.component(Submenu.name, Submenu)
Vue.component(MenuItem.name, MenuItem)
Vue.component(Upload.name, Upload)
Vue.prototype.$message = Message
Vue.use(Loading.directive)

import "element-ui/lib/theme-chalk/index.css"

// 引入socketio
// import SIO from "socket.io-client"
const SIO = require("socket.io-client/dist/socket.io")
// 服务器地址
const SERVER_HOST =
  process.env.NODE_ENV === "production"
    ? "119.23.52.173:7003"
    : "127.0.0.1:7003"
// const SERVER_HOST = "119.23.52.173:7003"
// 将socket注入全局对象
Vue.prototype.$socket = SIO
Vue.prototype.SERVER_HOST = SERVER_HOST
// axios封装
import { baseAjax } from "cc-vue-util"
Vue.prototype.$ajax = baseAjax(`http://${SERVER_HOST}`)
// vuex - store对象
import store from "./store"
Vue.prototype.$store = store

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
})
