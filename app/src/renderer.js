/* eslint-disable no-undef */ // for window and document
const { changeLanguage, getLanguage } = require("../database/storm");
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
  window.localization.translate = {
    searchText: function () {
      document.getElementById("search").placeholder = window.i18n.__("search");
    },
    listsText: function () {
      document.getElementById("my-lists").innerText =
        window.i18n.__("my_lists");
    },
    preferencesText: function () {
      document.getElementById("preferences").innerText =
        window.i18n.__("preferences");
    },
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
      if (
        document.body.dataset.page === undefined ||
        document.body.dataset.page === "default"
      ) {
        this.searchText();
        this.listsText();
        this.preferencesText();
      } else if (document.body.dataset.page === "preferences") {
        this.preferencesLanguage();
        this.preferencesAppearance();
        this.preferencesLangLabel();
        this.preferencesAppearanceP();
        this.preferencesGoBack();
        this.preferencesAppearanceH();
        this.preferencesLanguageH();
      }
    },
  };

  localization.translate.init();
})();
// Settings Page
let prevPageState;

// eslint-disable-next-line no-unused-vars
function showSettings() {
  fetch("settings.html")
    .then((response) => response.text())
    .then((html) => {
      let style = document.getElementById("title").style.backgroundColor + "";
      prevPageState = document.body.innerHTML;
      document.body.innerHTML = html;
      document.body.dataset.page = "preferences";
      localization.translate.init();
      languageSelectPrep();
      document.getElementById("title").style.backgroundColor = style;
      window.events();
    })
    .catch((error) => {
      console.warn(error);
    });
}

// eslint-disable-next-line no-unused-vars
function goBack() {
  if (prevPageState.length > 0) {
    document.body.innerHTML = prevPageState;
    document.body.dataset.page = "default";
  } else {
    fetch("index.html")
      .then((response) => response.text())
      .then((html) => {
        let bodyExpression = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
        document.body.innerHTML = html.match(bodyExpression)[1];
        document.body.dataset.page = "default";
        localization.translate.init();
      })
      .catch((error) => {
        console.warn(error);
      });
  }
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
function scrollToDiv(id) {
  document.getElementById("sections").scrollTop =
    document.getElementById(id).offsetTop - 35;
}

// Default Page

const clearAnimated = (elementID) => {
  setTimeout(
    () => document.getElementById(elementID).classList.remove("animated"),
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
  taskAdd.style.transition = "all 0.3s ease-in-out";
  taskAdd.style.transform = "rotate(45deg) scale(1.4)";
  taskAdd.onclick = closeAddToDo;
  clearAnimated("task-input");
}

function closeAddToDo() {
  let taskAdd = document.getElementById("task-add");
  taskAdd.style.transition = "all 0.3s ease-in-out";
  taskAdd.style.transform = "rotate(0deg) scale(1)";
  taskAdd.onclick = addToDo;
  document.getElementById("task-input").classList.remove("bounceIn");

  document.getElementById("task-input").classList.add("bounceOut", "animated");
  document.getElementById("add-input").value = null;
  setTimeout(
    () => (document.getElementById("task-input").style.display = "none"),
    300
  );
  taskAdd.onclick = addToDo;
  clearAnimated("task-input");
}

document.getElementById("add-input").addEventListener("keyup", (event) => {
  if (
    event.key === "enter" ||
    event.key === "Enter" ||
    event.keyCode === "13"
  ) {
    try {
      let input = document.getElementById("add-input");
      let todoList = document.getElementById("todolist");
      let frag = document.createDocumentFragment();
      let newInput = document.createElement("input");
      let label = document.createElement("label");

      newInput.type = "checkbox";
      newInput.id = Event.createToDo(input.value, input.dataset.listid) + 1;
      newInput.dataset.listid = input.dataset.listid;
      newInput.checked = false;
      newInput.addEventListener("change", Event.todoListener);

      label.id = newInput.id + "_label";
      label.setAttribute("for", newInput.id);
      label.innerText = input.value;
      label.classList.add("pulse", "animated");
      frag.appendChild(newInput);
      frag.appendChild(label);
      todoList.appendChild(frag);
      clearAnimated(label.id);

      input.value = null;
    } catch (error) {
      console.log(error);
    }
  }
});

document.getElementById("search").addEventListener("change", (event) => {
  console.log(event.target.value);
});

(function () {
  Event.loadLists(document.getElementById("todolists"), document);
  window.events();
})();

// TODO: boşluğa tıklandığında kaybolsun
