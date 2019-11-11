<!--
 * @Description: 注册页面
 * @Author: chenchen
 * @Date: 2019-10-28 12:53:40
 * @LastEditors: chenchen
 * @LastEditTime: 2019-11-07 23:18:04
 -->
<template>
  <div class="regist">
    <el-card :body-style="{ padding: '10px' }">
      <div slot="header">
        <span class="regist__title">用户注册</span>
      </div>
      <el-form :model="formObj"
               ref="form"
               label-width="80px">
        <el-form-item label="昵称">
          <el-input v-model="formObj.nickName"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="formObj.userId"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password"
                    v-model="formObj.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input type="password"
                    v-model="formObj.repassw"></el-input>
        </el-form-item>
        <div class="regist__submit">
          <el-button @click="$router.back()">取消</el-button>
          <el-button type="primary"
                     @click="doRegist">注册</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
	name: "regist",

	data() {
		return {
			formObj: {
				nickName: "",
				userId: "",
				password: "",
				repassw: ""
			}
		}
	},

	methods: {
		async doRegist() {
			let data = {
				user_id: this.formObj.userId,
				password: this.formObj.password,
				nick_name: this.formObj.nickName
			}
			let result = await this.$ajax.doPost("/regist", data)
			if (result.status === "success") {
				this.$message({
					message: "注册成功",
					type: "success"
				})
				this.$router.push({ path: "/" })
			} else {
				this.$message.error(result.msg)
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.regist {
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