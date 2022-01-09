const { getLanguage } = require("../database/storm");
const Event = new (require("./events"))();
window.events = function () {
  // macOS Events
  if (process.platform === "darwin") {
    const { ipcRenderer } = require("electron");
    let titleBarMacOS = document.getElementById("macos-titlebar");
    let titleBarContent = document.getElementById("button-container");

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
  else if (process.platform === "win32") {
    const remote = require("@electron/remote");
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
};
// Localization
window.i18n = new (require("../localization/i18n"))(getLanguage());
window.localization = window.localization || {};
(function () {
  if (
    window.location.pathname
      .split("/")
      [window.location.pathname.split("/").length - 1].split(".")[0] === "index"
  ) {
    window.localization.translate = {
      searchText: function () {
        document.getElementById("search").placeholder =
          window.i18n.__("search");
      },
      listsText: function () {
        document.getElementById("my-lists").innerText =
          window.i18n.__("my_lists");
      },
      preferencesText: function () {
        document.getElementById("preferences").innerText =
          window.i18n.__("preferences");
      },
      init: function () {
        this.searchText();
        this.listsText();
        this.preferencesText();
      },
    };
  } else {
    window.localization.translate = {
      preferencesLanguage: function () {
        document.getElementById("preferences-language").innerText =
          window.i18n.__("preferences-language");
      },
      preferencesAppearance: function () {
        document.getElementById("preferences-appearance").innerText =
          window.i18n.__("preferences-appearance");
      },
      preferencesLangLabel: function () {
        document.getElementById("preferences-lang-l").innerText =
          window.i18n.__("preferences-lang-l");
      },
      preferencesAppearanceP: function () {
        document.getElementById("preferences-appearance-p").innerText =
          window.i18n.__("preferences-appearance-p");
      },
      preferencesGoBack: function () {
        document.getElementById("back-button").innerText =
          window.i18n.__("back-button");
      },
      preferencesAppearanceH: function () {
        document.getElementById("preferences-appearance-h").innerText =
          window.i18n.__("preferences-appearance-h");
      },
      preferencesLanguageH: function () {
        document.getElementById("preferences-language-h").innerText =
          window.i18n.__("preferences-language-h");
      },
      init: function () {
        this.preferencesLanguage();
        this.preferencesAppearance();
        this.preferencesLangLabel();
        this.preferencesAppearanceP();
        this.preferencesGoBack();
        this.preferencesAppearanceH();
        this.preferencesLanguageH();
      },
    };
  }

  window.localization.translate.init();
})();

(function () {
  window.location.pathname
    .split("/")
    [window.location.pathname.split("/").length - 1].split(".")[0] ===
    "index" && Event.loadLists(document.getElementById("todolists"), document);
  window.events();
})();
