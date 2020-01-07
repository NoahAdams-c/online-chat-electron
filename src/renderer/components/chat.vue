<!--
 * @Description: 
 * @Author: OBKoro1
 * @Date: 2019-08-28 15:10:22
 * @LastEditors: chenchen
 * @LastEditTime: 2020-01-07 17:19:13
 -->
<template>
  <div class="chat">
    <el-card :body-style="{ padding: '0px', height: '100%' }">
      <el-container>
        <!-- 侧边栏 -->
        <el-aside>
          <!-- 用户信息 -->
          <div class="chat__user">
            <div class="chat__user--avatar">
              <el-upload :action="
                  `http://${SERVER_HOST}/${userInfo.user_id}/uploadAvatar`
                "
                         :show-file-list="false"
                         :on-success="afterUploadAvatar">
                <div class="avatar-img"
                     :style="`background: url(${avatarUrl});`" />
              </el-upload>
            </div>
            <div class="chat__user--name">
              {{ userInfo.nick_name }}
            </div>
          </div>

          <!-- 聊天列表 -->
          <div v-loading="isLoadingList"
               class="chat__slist">
            <div v-for="(item, index) in getOnlineUsers"
                 :key="index"
                 class="chat__slist--item"
                 :class="{ active: toWho.user_id === item.user_id }"
                 @click="startChat(item)">
              <img class="chat__slist--item__avatar"
                   :src="item.avatar"></img>
              <div class="chat__slist--item__nickname">{{ item.nick_name }}</div>
              <div v-if="unreadSessionList.indexOf(item.user_id) > -1"
                   class="chat__slist--item__unread">
                New
              </div>
            </div>
          </div>
          <!-- 底部菜单 -->
          <div class="chat__menu">
            <div class="chat__menu--item">
              <i class="el-icon-setting"
                 title="设置" />
            </div>
            <div class="chat__menu--item">
              <i class="el-icon-circle-plus-outline"
                 title="添加朋友" />
            </div>
            <div class="chat__menu--item">
              <i class="el-icon-switch-button"
                 title="退出"
                 @click="logout" />
            </div>
          </div>
        </el-aside>
        <!-- 主界面 -->
        <el-main height="">
          <template v-if="!!toWho.user_id">
            <!-- 标题 -->
            <div class="chat__title">
              {{ toWho.nick_name }}
            </div>
            <!-- 对话展示 -->
            <div v-loading="isLoadingMsg"
                 class="chat__view"
                 ref="chatview">
              <!-- <textarea ref="viewTextarea" v-model="logs" readonly /> -->
              <div class="chat__view--msgbox"
                   :class="
                  item.user_id === userInfo.user_id
                    ? 'float-right'
                    : 'float-left'
                "
                   v-for="(item, index) of msgList"
                   :key="index">
                <div class="chat__view--msgbox__content">
                  {{ item.content }}
                </div>
              </div>
            </div>
            <!-- 输入部分 -->
            <div class="chat__write">
              <textarea ref="writeTextarea"
                        v-model="msg"
                        @keypress.enter="sendMessage" />
              </div>
          </template>
          <!-- 当未选择用户开始会话时展示空白页 -->
          <template v-else>
            <div class="chat__blank">
              赶紧找个基友开始聊天吧！
            </div>
          </template>
        </el-main>
      </el-container>
    </el-card>
  </div>
</template>

<script>
import { trim } from "lodash"
import { mapGetters } from "vuex"

export default {
  name: "Chat",

  data() {
    return {
      userInfo: {}, // 用户信息
      avatarUrl: "", // 头像url
      msg: "", // 当前输入的消息
      logs: "", // 消息缓存
      toWho: {}, // 消息接收方的userId,nickName
      socketObj: null, // socket对象
      isLoadingList: true, // 是否正在加载在线列表
      isLoadingMsg: true, // 是否正在加载历史消息
      // isMobile: false
      unreadSessionList: [], // 未读会话列表
      msgList: []
    }
  },

  // 路由守卫拦截非法进入主界面
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.getLoginStatus) {
        next()
      } else {
        vm.$router.push({ path: "/" })
      }
    })
  },

  computed: {
    ...mapGetters([
      "getSocket",
      "getOnlineUsers",
      "getUserInfo",
      "getLoginStatus"
    ])
  },

  watch: {
    getOnlineUsers: {
      handler(curVal, oldVal) {
        if (curVal && curVal.length) {
          let flag = false
          for (let item of curVal) {
            if (item.user_id === this.toWho.user_id) {
              flag = true
              break
            }
          }
          flag ? null : (this.toWho = {})
        } else {
          this.toWho = {}
        }
      },
      deep: true
    },
    msgList: {
      handler() {
        // 每当消息展示框消息队列变化时将滚动条移至底部
        this.$nextTick(() => {
          this.$refs.chatview.scrollTop = this.$refs.chatview.scrollHeight
        })
      },
      deep: true
    }
  },

  created() {
    // 从store中获取用户信息和socket对象
    this.userInfo = this.getUserInfo
    this.avatarUrl = "http://" + this.SERVER_HOST + this.userInfo.avatar
    this.socketObj = this.getSocket
    // 延迟一秒关闭加载状态以获取在线用户列表
    setTimeout(() => {
      this.isLoadingList = false
    }, 1000)
    if (this.socketObj) {
      // 监听服务端发送的消息
      this.socketObj.on("resp", data => {
        console.log(data)
        // 仅当收发人为当前会话收发人时才将消息缓存并显示
        if (
          data.from === this.toWho.user_id &&
          data.to === this.userInfo.user_id
        ) {
          // this.logs += `\n${new Date().toLocaleString()}\n`
          // this.logs += `${this.toWho.nickName}：${data.msg}\n`
          this.msgList.push({
            user_id: data.from,
            content: data.msg,
            created_at: data.created_at
          })
        } else {
          // 否则将userId存入未读会话列表并在会话列表提示
          this.unreadSessionList.push(data.from)
        }
      })
    }
  },

  methods: {
    /**
     * 点击在线用户开始聊天
     */
    async startChat(toWho) {
      // 如存在于未读会话中则先移除
      let index = this.unreadSessionList.indexOf(toWho.user_id)
      if (index > -1) {
        this.unreadSessionList.splice(index, 1)
      }
      // 清空消息展示缓存
      this.logs = ""
      // 设置接收方
      this.toWho = toWho
      // 历史消息查询结束时间设为当前时间
      let end_date = new Date()
      // 历史消息查询开始时间设为一天前
      let start_date = new Date(end_date - 24 * 60 * 60 * 1000)
      // 查询历史消息
      let params = {
        user_id: this.userInfo.user_id,
        to_who: this.toWho.user_id,
        start_date: start_date,
        end_date: end_date
      }
      let _data = await this.$ajax.doGet("/getRecords", params)
      // 关闭加载状态
      this.isLoadingMsg = false
      if (_data.status === "success") {
        this.msgList = _data.data
        // _data.data.forEach(item => {
        //   // 将历史消息数据拼接到消息缓存
        //   if (item.user_id === this.userInfo.user_id) {
        //     // 如果历史消息的发起者为当前用户，则消息人以‘我’为称呼
        //     this.logs += `\n${new Date(item.created_at).toLocaleString()}\n`
        //     this.logs += `我：${item.content}\n`
        //   } else {
        //     // 如果历史消息的发起者不是当前用户，则消息人以发起用户昵称为称呼
        //     this.logs += `\n${new Date(item.created_at).toLocaleString()}\n`
        //     this.logs += `${this.toWho.nickName}：${item.content}\n`
        //   }
        // })
      }
      // this.$refs.viewTextarea.scrollTop = this.$refs.viewTextarea.scrollHeight
    },

    /**
     * 发送消息给服务端
     */
    sendMessage() {
      this.msg = trim(this.msg)
      // 拼接发送消息到消息缓存
      // this.logs += `\n${new Date().toLocaleString()}\n`
      // this.logs += `我：${this.msg}\n`
      this.msgList.push({
        user_id: this.userInfo.user_id,
        content: this.msg,
        created_at: new Date()
      })
      let data = {
        msg: this.msg,
        to: this.toWho.user_id
      }
      // 调起后台chat事件发送消息
      this.socketObj.emit("chat", data)
      // 每次输入发送完清空输入框
      this.msg = ""
      // let textarea = this.$refs.writeTextarea
      // textarea.selectionStart = textarea.selectionEnd = 0
    },

    /**
     * 登出并断开socket连接
     */
    logout() {
      // 断开soket连接
      this.socketObj.close()
      // 清除store中缓存的socket对象
      this.$store.commit("updateSocket", null)
      // 跳转回登录页
      this.$router.push({ path: "/" })
    },

    /**
     * 上传头像成功回调
     */
    afterUploadAvatar(data) {
      this.userInfo.avatar = data.data.path
      this.$store.commit("updateUserInfo", this.userInfo)
      this.avatarUrl = "http://" + this.SERVER_HOST + this.userInfo.avatar
    }
  }
}
</script>

<style scoped lang="scss">
.chat {
  .el-card {
    border: 0;
    position: absolute;
    // border-radius: 10px;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    // @media screen and (max-width: 768px) {
    // 	height: 85%;
    // 	width: 95%;
    // }
    // @media screen and (min-width: 769px) {
    // 	height: 500px;
    // 	width: 800px;
    // }
    height: 500px;
    width: 800px;
  }
  .el-container {
    height: 100%;
  }
  // 侧边栏
  .el-aside {
    display: flex;
    flex-direction: column;
    border-right: 1px solid #eee;
    height: 500px;
    // @media screen and (max-width: 768px) {
    // 	height: 100%;
    // 	width: 9rem !important;
    // }
    // @media screen and (min-width: 769px) {
    // 	height: 500px;
    // 	width: 200px !important;
    // }
    width: 200px !important;
  }
  &__user {
    display: flex;
    align-items: center;
    background-color: #409eff;
    &--avatar {
      margin: 15px;
      .avatar-img {
        height: 45px;
        width: 45px;
        background-repeat: no-repeat !important;
        background-size: contain !important;
        border-radius: 100px;
      }
    }
    &--name {
      display: inline-block;
      color: #fff;
      font-size: 24px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  &__slist {
    flex: 1;
    overflow-y: auto;
    &--item {
      cursor: pointer;
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      color: #606266;
      background-color: #ebeef5;
      display: flex;
      align-items: center;
      &.active {
        background-color: #79bbff;
      }
      &__avatar {
        width: 30px;
      }
      &__nickname {
        flex: 1;
        padding: 5px;
      }
      &__unread {
        display: inline-block;
        float: right;
        color: red;
        font-size: 12px;
      }
    }
    &--item ~ &--item {
      border-top: 1px solid #fff;
    }
  }
  &__menu {
    display: flex;
    align-items: center;
    border-top: 1px solid #eee;
    padding: 5px 10px;
    height: 30px;
    &--item {
      flex: 1;
      text-align: center;
      padding: 5px 10px;
      cursor: pointer;
    }
  }
  // 主界面
  .el-main {
    position: relative;
    overflow: hidden;
    height: 500px;
    padding: 0;
  }
  &__title {
    font-size: 28px;
    padding: 10px;
    height: 40px;
    border-bottom: 1px solid #eee;
  }
  &__view {
    height: calc(100% - 160px);
    margin-bottom: 10px;
    overflow-y: auto;
    textarea {
      height: 100%;
      width: 100%;
      border: unset;
      outline: unset;
      resize: none;
    }
    &--msgbox {
      display: flex;
      margin: 5px;
      &__content {
        width: fit-content;
        height: fit-content;
        border-radius: 5px;
        padding: 5px;
        max-width: 40%;
        overflow-wrap: break-word;
      }
    }
    &--msgbox.float-right {
      flex-direction: row-reverse;
      .chat__view--msgbox__content {
        background-color: #eaeaea;
      }
    }
    &--msgbox.float-left {
      flex-direction: row;
      .chat__view--msgbox__content {
        background-color: #79bbff;
      }
    }
  }
  &__write {
    height: 100px;
    border-top: 1px solid #eaeaea;
    textarea {
      outline: unset;
      height: calc(100% - 2px);
      width: calc(100% - 2px);
      border: 0;
      resize: none;
    }
  }
  &__blank {
    font-size: 30px;
    color: #a0a0a0;
    text-align: center;
    position: absolute;
    width: 100%;
    transform: translate(0, -50%);
    top: 50%;
  }

  // 滚动条样式
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-thumb {
    width: 5px;
    border-radius: 5px;
    background-color: #79bbff;
  }
  ::-webkit-scrollbar-track {
    width: 5px;
  }
  ::-webkit-scrollbar-button {
    display: none;
  }
}
</style>
