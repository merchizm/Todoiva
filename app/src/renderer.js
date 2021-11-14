/* eslint-disable no-undef */ // for window and document
// macOS Events
if (process.platform === "darwin") {
  const { ipcRenderer } = require("electron");
  let titleBarMacOS = document.getElementById("macos-titlebar");
  let titleBarContent = document.getElementById("task-button");

  ipcRenderer.on("mac-efull", () => {
    titleBarMacOS.style.paddingLeft = "5px";
    titleBarContent.style.paddingLeft = "5px";
  });

  ipcRenderer.on("mac-lfull", () => {
    titleBarMacOS.style.paddingLeft = "2vw";
    titleBarContent.style.paddingLeft = "74px";
  });
}
// windows Events
if (process.platform === "win32") {
  const remote = require("electron");
  const win = remote.getCurrentWindow();

  window.onbeforeunload = () => {
    /* If window is reloaded, remove win event listeners
    (DOM element listeners get auto garbage collected but not
    Electron win listeners as the win is not dereferenced unless closed) */
    win.removeAllListeners();
  };

  document.getElementById("min-button").addEventListener("click", () => {
    win.minimize();
  });

  document.getElementById("max-button").addEventListener("click", () => {
    win.maximize();
  });

  document.getElementById("restore-button").addEventListener("click", () => {
    win.unmaximize();
  });

  document.getElementById("close-button").addEventListener("click", () => {
    win.close();
  });
}
// Localization
window.i18n = new (require("../localization/i18n"))();
window.localization = window.localization || {};
(function () {
  window.localization.translate = {
    searchText: function () {
      document.getElementById("search").placeholder = window.i18n.__("search");
    },
    listsText: function () {
      document.getElementById("my-lists").innerText =
        window.i18n.__("my_lists");
    },
    settingsText: function () {
      document.getElementById("settings").innerText =
        window.i18n.__("settings");
    },
    init: function () {
      this.searchText();
      this.listsText();
      this.settingsText();
    },
  };

  localization.translate.init();
})();
// Settings Page
// eslint-disable-next-line no-unused-vars
function showSettings() {
  fetch("settings.html" /*, options */)
    .then((response) => response.text())
    .then((html) => {
      document.body.innerHTML = html;
      languageSelectPrep();
    })
    .catch((error) => {
      console.warn(error);
    });
}

function languageSelectPrep() {
  const languages = require("../localization/meta.json");
  let select = document.getElementById("language");
  Object.keys(languages.languages).forEach((element) => {
    let option = document.createElement("option");
    option.text = languages.languages[element];
    option.value = element;
    select.add(option);
  });
}
// eslint-disable-next-line no-unused-vars
function languageSelectOnChange() {
  const { changeLanguage } = require("../database/storm");
  let select = document.getElementById("language").value;
  changeLanguage(select);
}
