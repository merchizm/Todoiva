/* eslint-disable no-undef */ // for window and document
const { changeLanguage, getLanguage } = require("../database/storm");
const Event = new (require("./events"))();
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
if (process.platform === "win32") {
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
// Localization
window.i18n = new (require("../localization/i18n"))(getLanguage());
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
    settingsLanguage: function () {
      document.getElementById("settings-language").innerText =
        window.i18n.__("settings-language");
    },
    settingsTheme: function () {
      document.getElementById("settings-theme").innerText =
        window.i18n.__("settings-theme");
    },
    settingsLangLabel: function () {
      document.getElementById("settings-lang-l").innerText =
        window.i18n.__("settings-lang-l");
    },
    settingsThemeP: function () {
      document.getElementById("settings-theme-p").innerText =
        window.i18n.__("settings-theme-p");
    },
    settingsGoBack: function () {
      document.getElementById("back-button").innerText =
        window.i18n.__("back-button");
    },
    init: function () {
      if (
        document.body.dataset.page === undefined ||
        document.body.dataset.page === "default"
      ) {
        this.searchText();
        this.listsText();
        this.settingsText();
      } else if (document.body.dataset.page === "settings") {
        this.settingsLanguage();
        this.settingsTheme();
        this.settingsLangLabel();
        this.settingsThemeP();
        this.settingsGoBack();
      }
    },
  };

  localization.translate.init();
})();
// Settings Page
// eslint-disable-next-line no-unused-vars
function showSettings() {
  fetch("settings.html")
    .then((response) => response.text())
    .then((html) => {
      document.body.innerHTML = html;
      document.body.dataset.page = "settings";
      localization.translate.init();
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
    getLanguage() === element && option.setAttribute("selected", true);
    select.add(option);
  });
}
// eslint-disable-next-line no-unused-vars
function languageSelectOnChange() {
  let select = document.getElementById("language").value;
  changeLanguage(select);
}

// eslint-disable-next-line no-unused-vars
function goBack() {
  fetch("index.html")
    .then((response) => response.text())
    .then((html) => {
      let bodyExpression = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
      document.body.innerHTML = html.match(bodyExpression)[0];
      document.body.dataset.page = "default";
      localization.translate.init();
    })
    .catch((error) => {
      console.warn(error);
    });
}

// eslint-disable-next-line no-unused-vars
function settingsNavigation(event, Section) {
  let i, tabContent, tabNav;

  tabContent = document.getElementsByClassName("content");
  for (i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = "none";
  }

  tabNav = document.getElementsByClassName("nav");
  for (i = 0; i < tabNav.length; i++) {
    tabNav[i].className = tabNav[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the link that opened the tab
  document.getElementById(Section).style.display = "block";
  event.currentTarget.className += " active";
}

// Defalut Page

const clearAnimated = () => {
  setTimeout(
    () => document.getElementById("task-input").classList.remove("animated"),
    300
  );
};

function addToDo() {
  document.getElementById("task-input").style.display = "block";
  setTimeout(
    () => document.getElementById("task-input").classList.add("animated"),
    10
  );
  let taskAdd = document.getElementById("task-add");
  taskAdd.style =
    "transition: all 0.3s ease-in-out; transform: rotate(45deg) scale(1.4);";
  taskAdd.onclick = closeAddToDo;
  clearAnimated();
}

function closeAddToDo() {
  let taskAdd = document.getElementById("task-add");
  taskAdd.style =
    "transition: all 0.3s ease-in-out; transform: rotate(0deg) scale(1);";
  taskAdd.onclick = addToDo;
  document.getElementById("task-input").classList.remove("bounceIn");

  document.getElementById("task-input").classList.add("bounceOut");
  document.getElementById("task-input").classList.add("animated");
  document.getElementById("add-input").value = null;
  setTimeout(
    () => (document.getElementById("task-input").style.display = "none"),
    300
  );
  taskAdd.onclick = addToDo;
  clearAnimated();
}

document.getElementById("add-input").addEventListener("keyup", (event) => {
  if (
    event.key === "enter" ||
    event.key === "Enter" ||
    event.keyCode === "13"
  ) {
    let input = document.getElementById("add-input");
    Event.createToDo(input.value, input.dataset.listid);
    input.value = null;
  }
});

(function () {
  Event.LoadLists(document.getElementById("todolists"), document);
})();

// TODO: boşluğa tıklandığında kaybolsun
