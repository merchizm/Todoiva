const db = require("../database/storm");

const events = function () {
  events.prototype._createToDo = db.createToDo;
  events.prototype._lls = db.loadLists;
  events.prototype._ll = db.loadList;
  events.prototype._todoCheckedStatus = db.todoCheckedStatus;
  events.prototype._getLastListID = db.getLastListID;
  events.prototype._setLastListID = db.setLastListID;
  events.prototype._getSCI = db.getShowCompletedItems;
};

events.prototype.loadLists = function (element, jsonData = null) {
  jsonData ||= events.prototype._lls(); // for new ones
  jsonData.forEach((list) => {
    (function () {
      // set element variables
      let li = document.createElement("li");
      let frag = document.createDocumentFragment();
      let span = document.createElement("span");
      let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      let svgPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      // set element attributes and append chlids
      li.classList.add(`color-${list.listColor}`);
      span.classList.add(`color-${list.listColor}`);
      li.onclick = function () {
        events.prototype.loadList(list.listID);
      };
      svg.setAttribute("id", list.listID);
      svg.setAttribute("viewBox", "0 0 200 200");
      svgPath.setAttribute(
        "d",
        "M75,57.5h95a10,10,0,0,0,0-20H75a10,10,0,0,0,0,20Zm-35-20H30a10,10,0,0,0,0,20H40a10,10,0,0,0,0-20Zm35,70h75a10,10,0,0,0,0-20H75a10,10,0,0,0,0,20Zm-35-20H30a10,10,0,0,0,0,20H40a10,10,0,0,0,0-20Zm130,55H75a10,10,0,0,0,0,20h95a10,10,0,0,0,0-20Zm-130,0H30a10,10,0,0,0,0,20H40a10,10,0,0,0,0-20Z"
      );
      svg.appendChild(svgPath);
      span.appendChild(svg);
      frag.appendChild(span);
      frag.appendChild(document.createTextNode(list.listName));
      li.appendChild(frag);
      element.appendChild(li);
    })();
  });
  events.prototype._getLastListID() !== undefined &&
    events.prototype.loadList(events.prototype._getLastListID());
  document.querySelectorAll("input[type=checkbox]").forEach((item) => {
    item.addEventListener("change", events.prototype.todoListener);
  });
};

let getColor = function (colorID) {
  switch (colorID) {
    case "red":
      return "#E25757";
    case "green":
      return "#43B343";
    case "blue":
      return "#5FA4FF";
    case "purple":
      return "#A766D3";
    case "orange":
      return "#FC9B2D";
    case "pink":
      return "#E043C3";
    default:
      return "#7366D3";
  }
};

events.prototype.loadList = function (listID, loadComps = undefined) {
  loadComps ||= events.prototype._getSCI();
  let jsonData = events.prototype._ll(listID);

  // set things
  document.getElementById("list-name").innerText = jsonData.listName;
  document.getElementById("add-input").dataset.listid = jsonData.listID;
  document.getElementById("title").style.backgroundColor = getColor(
    jsonData.listColor
  );
  if (JSON.stringify(jsonData).toLowerCase().includes("true"))
    document.getElementsByClassName("completed-items")[0].style.display =
      "block";
  else
    document.getElementsByClassName("completed-items")[0].style.display =
      "none";

  let completedItemsCount = 0;
  // load todolist
  let todoList = document.getElementById("todolist");
  todoList.innerHTML = "";

  jsonData.listItems.forEach((todoItem) => {
    if (todoItem.checked) completedItemsCount++;
    if (todoItem.checked && loadComps === false) {
      // pass
    } else {
      let frag = document.createDocumentFragment();
      let input = document.createElement("input");
      let label = document.createElement("label");

      input.type = "checkbox";
      input.id = todoItem.itemID;
      input.dataset.listid = listID;
      input.addEventListener("change", this.todoListener);
      input.checked = todoItem.checked;
      label.id = input.id + "_label";
      label.setAttribute("for", todoItem.itemID);
      label.innerText = todoItem.itemName;

      frag.appendChild(input);
      frag.appendChild(label);
      todoList.appendChild(frag);
    }
  });

  events.prototype._setLastListID(listID);

  const showText =
    document.getElementsByClassName("completed-items")[0].children[0]
      .children[1].dataset.show;

  const hideText =
    document.getElementsByClassName("completed-items")[0].children[0]
      .children[1].dataset.hide;

  if (loadComps)
    document.getElementsByClassName(
      "completed-items"
    )[0].children[0].children[1].innerText = hideText;
  else
    document.getElementsByClassName(
      "completed-items"
    )[0].children[0].children[1].innerText = showText;

  document.getElementsByClassName(
    "completed-items"
  )[0].children[0].children[0].children[0].innerHTML =
    completedItemsCount.toString();
};

events.prototype.search = function (v, ele) {
  let jsonData = events.prototype._lls();
  let value = v.toLowerCase().trim();
  const result = jsonData.filter((data) => {
    return Object.keys(data).some((key) => {
      return JSON.stringify(data[key]).toLowerCase().trim().includes(value);
    });
  });
  events.prototype.loadLists(ele, result);
};

events.prototype.createToDo = function (value, listID) {
  events.prototype._createToDo(value, listID);
  return db.getLength(listID);
};

events.prototype.todoListener = function (event) {
  events.prototype._todoCheckedStatus(
    event.target.id,
    event.target.dataset.listid,
    event.target.checked
  );
};

module.exports = events;
