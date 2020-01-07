<!--
 * @Description: 登录页面
 * @Author: chenchen
 * @Date: 2019-10-28 15:31:32
 * @LastEditors: chenchen
 * @LastEditTime: 2020-01-07 16:14:26
 -->
<template>
  <div class="login">
    <el-card :body-style="{ padding: '10px' }">
      <div slot="header">
        <span class="login__title">用户登录</span>
      </div>
      <el-form ref="form"
               :model="formObj"
               label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="formObj.userId" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formObj.password"
                    type="password" />
        </el-form-item>
        <div class="login__submit">
          <el-button type="primary"
                     @click="doLogin">
            登录
          </el-button>
          <el-button @click="toRegist">
            注册
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Login",

  data() {
    return {
      formObj: {
        userId: "",
        password: ""
      }
    }
  },

  methods: {
    async doLogin() {
      let params = {
        user_id: this.formObj.userId,
        password: this.formObj.password
      }
      let result = await this.$ajax.doGet("/login", params)
      if (result.status === "success") {
        this.$message({
          message: "登录成功",
          type: "success"
        })
        // 登录成功将用户信息缓存到store并创建socket连接
        this.$store.commit("updateUserInfo", result.data)
        this.initSocket(result.data)
        this.$router.push({ path: "/chat" })
      } else {
        this.$message.error(result.msg)
      }
    },

    toRegist() {
      this.$router.push({ path: "/regist" })
    },

    initSocket(userInfo) {
      let socketObj = null
      // 创建socket
      console.log(this.SERVER_HOST)
      console.log(userInfo)
      socketObj = this.$socket(`ws://${this.SERVER_HOST}`, {
        query: {
          userInfo: JSON.stringify(userInfo)
        }
      })
      // 监听是否成功连接
      socketObj.on("connected", () => {
        console.log("连接已建立")
      })
      // 监听在线人数
      socketObj.on("onlineUsers", maps => {
        delete maps[userInfo.user_id]
        let onlineArrs = []
        for (let key in maps) {
          onlineArrs.push({
            user_id: key,
            nick_name: maps[key].nick_name,
            avatar: "http://" + this.SERVER_HOST + maps[key].avatar
          })
        }
        this.$store.commit("updateOnlineUsers", onlineArrs)
      })
      // 监听断连
      socketObj.on("disconnect", () => {
        console.log("连接已断开")
      })

      this.$store.commit("updateSocket", socketObj)
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  .el-card {
    // @media screen and (max-width: 768px) {
    // 	width: 90%;
    // }
    // @media screen and (min-width: 769px) {
    // 	width: 500px;
    // }
    background: rgba($color: #3a3a3a, $alpha: 0.6);
    border: unset;
    color: #eaeaea;
    width: 400px;
    position: absolute;
    border-radius: 10px;
    // width: 500px;
    transform: translate(-50%, -50%);
    top: 45%;
    left: 50%;
  }
  &/deep/.el-form-item__label {
    color: #eaeaea !important;
  }
  &__title {
    text-align: center;
    font-size: 26px;
  }
  &__submit {
    text-align: center;
    padding: 5px 0;
  }
}
</style>
