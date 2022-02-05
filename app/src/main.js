const { app, BrowserWindow, ipcMain, nativeTheme } = require("electron");
const path = require("path");
const { getAppearance, changeAppearance, getWindowStatus } = require("../database/storm");
const url = require("url");
const remote = require("@electron/remote/main");
remote.initialize();

function createWindow() {
  const prevSessionWindowStatus = getWindowStatus();
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 700,
    height: 600,
    minWidth: 600,
    minHeight: 500,
    icon: path.join(".../resources/todoiva.iconset/icon_128x128@x2.png"),
    titleBarStyle: "hiddenInset",
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });
  // https://www.electronjs.org/docs/latest/breaking-changes#planned-breaking-api-changes-140
  remote.enable(mainWindow.webContents);

  // set Appearance
  nativeTheme.themeSource = getAppearance();

  // dynamically change
  ipcMain.handle("dark-mode:light", () => {
    nativeTheme.themeSource = "light";
    changeAppearance("light");
  });

  ipcMain.handle("dark-mode:dark", () => {
    nativeTheme.themeSource = "dark";
    changeAppearance("dark");
  });

  ipcMain.handle("dark-mode:system", () => {
    nativeTheme.themeSource = "system";
    changeAppearance("system");
  });

  // and load the index.html of the app.
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  // MacOS Custom TitleBar events
  mainWindow.on("enter-full-screen", () => {
    if (process.platform === "darwin") mainWindow.webContents.send("mac-efull");
  });
  mainWindow.on("leave-full-screen", () => {
    if (process.platform === "darwin") mainWindow.webContents.send("mac-lfull");
  });

  // force external links to open in default browser
  /*  let handleRedirect = function (e, Url) {
    if (Url !== mainWindow.webContents.getURL()) {
      e.preventDefault();
      shell.openExternal(Url);
    }
  };

  mainWindow.webContents.on("will-navigate", handleRedirect);
  mainWindow.webContents.on("new-window", handleRedirect);*/
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);
// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
