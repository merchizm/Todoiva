const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("darkMode", {
  light: () => ipcRenderer.invoke("dark-mode:light"),
  dark: () => ipcRenderer.invoke("dark-mode:dark"),
  system: () => ipcRenderer.invoke("dark-mode:system"),
});
