/**
 * @Description:
 * @Author: OBKoro1
 * @Date: 2019-11-05 18:36:44
 * @LastEditors: chenchen
 * @LastEditTime: 2019-11-08 13:52:42
 */
import { app, BrowserWindow, globalShortcut } from "electron"

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
	global.__static = require("path")
		.join(__dirname, "/static")
		.replace(/\\/g, "\\\\")
}

let mainWindow
const winURL =
	process.env.NODE_ENV === "development"
		? `http://localhost:9080`
		: `file://${__dirname}/index.html`

function createWindow() {
	/**
	 * Initial window options
	 */
	mainWindow = new BrowserWindow({
		height: 500,
		width: 800,
		resizable: false,
		useContentSize: true,
		autoHideMenuBar: true
	})

	// 注册ctrl+shift+L打开调试模式
	globalShortcut.register("CommandOrControl+Shift+L", () => {
		let focusWin = BrowserWindow.getFocusedWindow()
		focusWin && focusWin.toggleDevTools()
	})

	mainWindow.loadURL(winURL)

	mainWindow.on("closed", () => {
		mainWindow = null
	})
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit()
	}
})

app.on("activate", () => {
	if (mainWindow === null) {
		createWindow()
	}
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
