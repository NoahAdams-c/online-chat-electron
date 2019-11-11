<!--
 * @Description: 
 * @Author: OBKoro1
 * @Date: 2019-08-28 15:08:39
 * @LastEditors: chenchen
 * @LastEditTime: 2019-11-07 23:25:10
 -->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
	name: "App"
}
</script>

<style>
#app {
	height: 100vh;
	/* background: url("./assets/bg.jpg"); */
}
#app::before {
	background: url("./assets/bg.jpg") no-repeat;
	background-size: cover;
	height: 500px;
	width: 800px;
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	z-index: -1;
	filter: blur(0.7px);
}
</style>
