const { ipcRenderer } = require("electron");
const Event = new (require("./events"))();
const remote = require("@electron/remote");
const win = remote.getCurrentWindow();

window.onbeforeunload = () => {
  /* If window is reloaded, remove win event listeners
  (DOM element listeners get auto garbage collected but not
  Electron win listeners as the win is not dereferenced unless closed) */
  win.removeAllListeners();
};

window.events = function () {
  // macOS Events
  if (process.platform === "darwin") {
    let titleBarMacOS = document.getElementById("title").children[0];
    let titleBarContent = document.getElementById("button-container");

    document.getElementById("title").children[1].remove(); // windows title bar removed.

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
    document.getElementById("title").children[0].remove(); // macOS title bar removed.

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

    let toggleMaxRestoreButtons = function () {
      if (win.isMaximized()) {
        document.body.classList.add("maximized");
      } else {
        document.body.classList.remove("maximized");
      }
    };

    toggleMaxRestoreButtons();
    win.on("maximize", toggleMaxRestoreButtons);
    win.on("unmaximize", toggleMaxRestoreButtons);
  }
};
// Localization
window.i18n = new (require("../localization/i18n"))(
  require("../database/storm").getLanguage()
);
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
      completedItemsText: function () {
        document.getElementsByClassName(
          "completed-items"
        )[0].children[0].children[0].children[1].innerText =
          window.i18n.__("completed-items");
      },
      showText: function () {
        document.getElementsByClassName(
          "completed-items"
        )[0].children[0].children[1].dataset.show = window.i18n.__("show");
      },
      hideText: function () {
        document.getElementsByClassName(
          "completed-items"
        )[0].children[0].children[1].dataset.hide = window.i18n.__("hide");
      },
      searchResults: function () {
        document.getElementById("my-lists").dataset.results =
          window.i18n.__("search-results");
      },
      notFound: function () {
        document.getElementById("my-lists").dataset.notfound =
          window.i18n.__("not-found");
      },
      init: function () {
        this.searchText();
        this.listsText();
        this.preferencesText();
        this.completedItemsText();
        this.showText();
        this.hideText();
        this.searchResults();
        this.notFound();
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
      preferencesAppearanceLight: function () {
        document.getElementById("light").innerText = window.i18n.__("light");
      },
      preferencesAppearanceDark: function () {
        document.getElementById("dark").innerText = window.i18n.__("dark");
      },
      preferencesAppearanceSC: function () {
        document.getElementById("system-choice").innerText =
          window.i18n.__("system-choice");
      },
      preferencesLanguageInfoBox: function () {
        document.getElementById("info-box").children[1].innerText =
          window.i18n.__("language-info");
      },
      preferencesImageAlts: function () {
        let locales = [
          window.i18n.__("light"),
          window.i18n.__("dark"),
          window.i18n.__("system-choice"),
        ];
        for (let i = 0; i <= 2; i++) {
          document.getElementsByTagName("figure")[i].children[0].alt =
            locales[i];
        }
      },
      init: function () {
        this.preferencesLanguage();
        this.preferencesAppearance();
        this.preferencesLangLabel();
        this.preferencesAppearanceP();
        this.preferencesGoBack();
        this.preferencesAppearanceH();
        this.preferencesLanguageH();
        this.preferencesAppearanceLight();
        this.preferencesAppearanceDark();
        this.preferencesAppearanceSC();
        this.preferencesLanguageInfoBox();
        this.preferencesImageAlts();
      },
    };
  }

  window.localization.translate.init();
})();

(function () {
  // Appearance setting
  if (
    window.location.pathname
      .split("/")
      [window.location.pathname.split("/").length - 1].split(".")[0] ===
    "preferences"
  ) {
    document
      .getElementById("dark_input")
      .addEventListener("click", async () => {
        await ipcRenderer.invoke("dark-mode:dark");
      });
    document
      .getElementById("light_input")
      .addEventListener("click", async () => {
        await ipcRenderer.invoke("dark-mode:light");
      });
    document.getElementById("sc_input").addEventListener("click", async () => {
      await ipcRenderer.invoke("dark-mode:system");
    });
  } else {
    Event.loadLists(document.getElementById("todolists"));
  }

  // window initializer/preparer
  window.events();

  // resizer
  const resizer = document.getElementsByClassName("resizer")[0];
  const aside = document.getElementsByTagName("aside")[0];
  let original_width, original_mouse_x;
  function resize(e) {
    aside.style.width = original_width + (e.pageX - original_mouse_x) + "px";
  }
  resizer.addEventListener("mousedown", function (e) {
    original_width = parseFloat(
      getComputedStyle(aside, null).getPropertyValue("width").replace("px", "")
    );
    original_mouse_x = e.pageX;
    e.preventDefault();
    window.addEventListener("mousemove", resize);

    window.addEventListener("mouseup", function () {
      window.removeEventListener("mousemove", resize);
      require("../database/storm").setMenuWidth(
        getComputedStyle(aside, null)
          .getPropertyValue("width")
          .replace("px", "")
      );
    });
  });
  // load menu Width
  aside.style.width =
    require("../database/storm").getMenuWidth() === 0
      ? aside.style.width
      : require("../database/storm").getMenuWidth() + "px";

  // context menu initializer
  function context_menu_intializer(event) {
    // whitelisted div id's
    let whitelist = ["todolists", "todolist"];
    // get target element and the element's tag name
    let target = event.target ? event.target : event.srcElement;
    let tagName = target.tagName.toLowerCase();

    let element = undefined;

    if (
      (whitelist.includes(target.parentElement.id) &&
        target.parentElement.id === "todolist") ||
      (tagName === "a" &&
        target.parentElement.getAttribute("for") !== undefined)
    ) {
      if (tagName === "label") {
        element = document.getElementById(target.getAttribute("for"));
      } else if (tagName === "a") {
        element = document.getElementById(
          target.parentElement.getAttribute("for")
        );
      } else {
        element = target;
      }

      let data = {
        list_id: element.dataset.listid,
        item_id: element.dataset.itemid,
      };
      console.log(data); // TODO: Add context menu constructor
    } else if (
      (whitelist.includes(target.parentElement.id) &&
        target.parentElement.id === "todolists") ||
      (tagName === "span" && target.className.includes("color-")) ||
      (tagName === "svg" &&
        target.parentElement.className.includes("color-")) ||
      (tagName === "path" &&
        target.parentElement.parentElement.className.includes("color-"))
    ) {
      if (tagName === "span") {
        element = target.parentElement;
      } else if (tagName === "svg") {
        element = target.parentElement.parentElement;
      } else if (tagName === "path") {
        element = target.parentElement.parentElement.parentElement;
      } else {
        element = target;
      }

      let data = {
        list_id: element.dataset.listid,
      };
      console.log(data); // TODO: Add context menu constructor
    } else {
      // TODO: empty data equals to developer context menu (if running development mode)
    }
  }
  document.body.oncontextmenu = context_menu_intializer;
})();

window.onload = function () {
  setTimeout(function () {
    document.getElementsByClassName("pre-loader")[0].style.display = "none";
  }, 200);
};
