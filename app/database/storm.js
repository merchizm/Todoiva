const remote = require("@electron/remote");
const electron = require("electron");
const StormDB = require("stormdb");
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
      listName: "Tutorial",
      listColor: colors[Math.floor(Math.random() * colors.length)],
      listIcon: null,
      listItems: [
        { itemID: 0, itemName: "Hello There !", checked: false },
        { itemID: 1, itemName: "This is your to-do list 🥰", checked: false },
        {
          itemID: 2,
          itemName: "There are to-do lists on the right.",
          checked: false,
        },
        {
          itemID: 3,
          itemName:
            "Right below the to-do lists we have a tiny button for settings.",
          checked: false,
        },
        {
          itemID: 4,
          itemName: "You can set your theme and language from settings.",
          checked: false,
        },
        {
          itemID: 5,
          itemName:
            "I may have more features in the future, but I will always be stylish and simple.",
          checked: false,
        },
        { itemID: 6, itemName: "XOXO", checked: false },
      ],
    },
  ],
  settings: {
    appearance: "system",
    language: app.getLocale(),
  },
});

db.save(); // for defaults

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

function createToDo(data, listID) {
  db.get("lists").get(listID).get("listItems").push(data).save();
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
};
