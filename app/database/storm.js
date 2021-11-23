const electron = require("electron");
const remote =
  process.type === "browser" ? electron : require("@electron/remote");
const StormDB = require("stormdb");
const i18n = new (require("../localization/i18n"))();
const { join } = require("path");
const app = electron.app ? electron.app : remote.app;

const database =
  process.env.NODE_ENV === "development"
    ? join(__dirname, "dev_db.json")
    : join(app.getPath("userData"), "todoiva_db.stormdb");
const engine = new StormDB.localFileEngine(database);
const db = new StormDB(engine);

// theme colors
const colors = ["red", "green", "blue", "purple", "orange", "pink"];

db.default({
  lists: [
    {
      listID: 0,
      listName: i18n.__("tutorial"),
      listColor: colors[Math.floor(Math.random() * colors.length)],
      listIcon: null,
      listItems: [
        { itemID: 0, itemName: i18n.__("hello-there"), checked: false },
        { itemID: 1, itemName: i18n.__("tut-i1"), checked: false },
        {
          itemID: 2,
          itemName: i18n.__("tut-i2"),
          checked: false,
        },
        {
          itemID: 3,
          itemName:
            process.platform === "darwin"
              ? i18n.__("tut-i3-for-mac")
              : process.platform === "win32"
              ? i18n.__("tut-i3-for-win")
              : i18n.__("tut-i3-for-linux"),
          checked: false,
        },
        {
          itemID: 4,
          itemName: i18n.__("tut-i4"),
          checked: false,
        },
        {
          itemID: 5,
          itemName: i18n.__("tut-i5"),
          checked: false,
        },
        { itemID: 6, itemName: i18n.__("tut-i6"), checked: false },
      ],
    },
  ],
  settings: {
    appearance: "system",
    language: app.getLocale(),
  },
});

db.save(); // for defaults

// exports

module.exports = {
  createList,
  createToDo,
  renameList,
  changeColor,
  changeIcon,
  removeCompletes,
  removeItem,
  loadLists,
  loadList,
  todoCheckedStatus,
  changeLanguage,
  changeAppearance,
  getAppearance,
  getLanguage,
};

// list actions

function createList(data) {
  let temp = {
    listID: db.get("lists").length + 1,
    listName: data.listName,
    listColor: colors[data.color],
    listIcon: data.listIcon,
    listItems: {},
  };
  db.get("lists").push(temp).save();
}

function createToDo(itemName, listID) {
  db.get("lists")
    .get(listID)
    .get("listItems")
    .push({
      itemID: db.get("lists").get(listID).get("listItems").value().length,
      itemName: itemName,
      checked: false,
    })
    .save();
}

function renameList(listID, newName) {
  db.get("lists")
    .get(listID)
    .get("listItems")
    .get("listName")
    .set(newName)
    .save();
}

function changeColor(listID, newColor) {
  db.get("lists")
    .get(listID)
    .get("listItems")
    .get("listColor")
    .set(colors[newColor])
    .save();
}

function changeIcon(listID, newIcon) {
  db.get("lists")
    .get(listID)
    .get("listItems")
    .get("listIcon")
    .set(newIcon)
    .save(); // TODO: create icons and array
}

function removeCompletes(listID) {
  db.get("lists")
    .get(listID)
    .get("listItems")
    .map((item) => {
      if (item.checked) {
        db.get("lists")
          .get(listID)
          .get("listItems")
          .get(item.itemID)
          .delete(true)
          .save();
      }
    });
}

function removeItem(itemID, listID) {
  db.get("lists").get(listID).get("listItems").get(itemID).delete(true).save();
}

function loadLists() {
  return db.get("lists").value();
}

function loadList(listID) {
  return db.get("lists").get(listID).value();
}

function todoCheckedStatus(itemID, listID, status) {
  db.get("lists")
    .get(listID)
    .get("listItems")
    .get(itemID)
    .get("checked")
    .set(status)
    .save();
}

// setting actions

function changeLanguage(lang) {
  const languages = require("../localization/meta.json")["languages"];
  if (typeof languages[lang] != "undefined") {
    db.get("settings").get("language").set(lang).save();
  } else {
    return false;
  }
}

function changeAppearance(newValue) {
  db.get("settings").get("appearance").set(newValue).save();
}

function getAppearance() {
  return db.get("settings").get("appearance").value();
}

function getLanguage() {
  return db.get("settings").get("language").value();
}
