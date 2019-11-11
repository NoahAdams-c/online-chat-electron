<!--
 * @Description: 
 * @Author: OBKoro1
 * @Date: 2019-08-28 15:10:22
 * @LastEditors: chenchen
 * @LastEditTime: 2019-10-28 12:07:14
 -->
<template>
  <div class="hello">
    <h1>namespace: /app</h1>
    <input v-model="uuid"
           type="text">
    <button @click="init">连接</button>
    <button @click="close">断开连接</button>
    <div>连接状态：{{status ? '已连接' : '未连接'}}</div>
    <div class="server-resp">
      <textarea v-model="logs"
                readonly
                cols="30"
                rows="10"></textarea>
      <button @click="logs = ''">清空消息区</button>
    </div>
    <br>
    <div class="send-block">
      <input @keypress.enter="sendMessage"
             v-model="msg"
             type="text">
      <button @click="sendMessage">发送</button>
      <!-- <button @click="sendHello">HELLO</button> -->
    </div>
  </div>
</template>

<script>
export default {
	name: "HelloWorld",

	data() {
		return {
			uuid: "",
			status: false,
			msg: "",
			logs: "",
			socketObj: null
		}
	},

	methods: {
		/**
		 * 发送消息给服务端
		 */
		sendMessage() {
			const vm = this
			vm.logs += "我：" + vm.msg + "\n"
			let data = {
				msg: vm.msg,
				uuid: vm.uuid
			}
			vm.socketObj.emit("chat", data)
		},

		sendHello() {
			const vm = this
			// vm.socketObj.emit("hello")
			vm.socketObj.emit("chat", "hello")
		},

		init() {
			const vm = this
			// 创建socket
			vm.socketObj = vm.$socket(`${vm.SERVER_HOST}/app?uuid=${vm.uuid}`)
			// 监听是否成功连接
			vm.socketObj.on("connected", () => {
				vm.logs += "连接已建立\n"
				vm.status = true
			})
			// 监听服务端发送的消息
			vm.socketObj.on("resp", msg => {
				vm.logs += "服务端：" + msg + "\n"
			})
			// 监听断连
			vm.socketObj.on("disconnect", () => {
				vm.logs += "连接已断开\n"
				vm.status = false
			})
		},

		close() {
			const vm = this
			vm.socketObj.close()
		}
	},

	created() {}
}
</script>

<style scoped lang="scss">
</style>
