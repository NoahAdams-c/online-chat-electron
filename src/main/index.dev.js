/**
 * @Description:
 *  This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 *
 * @Author: chenchen
 * @Date: 2019-11-05 17:49:28
 * @LastEditors: chenchen
 * @LastEditTime: 2019-11-05 17:50:19
 */

/* eslint-disable */

// Install `electron-debug` with `devtron`
require("electron-debug")({ showDevTools: true })

// Install `vue-devtools`
require("electron").app.on("ready", () => {
	let installExtension = require("electron-devtools-installer")
	installExtension
		.default(installExtension.VUEJS_DEVTOOLS)
		.then(() => {})
		.catch(err => {
			console.log("Unable to install `vue-devtools`: \n", err)
		})
})

// Require `main` process to boot app
require("./index")
