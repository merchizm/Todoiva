const db = require("../database/storm");

class Events {
  constructor() {
    this._createList = db.createList;
    this.createToDo = db.createToDo;
    this._renameList = db.renameList;
    this._changeColor = db.changeColor;
    this._changeIcon = db.changeIcon;
    this._removeCompletes = db.removeCompletes;
    this._removeItem = db.removeItem;
    this._lls = db.loadLists;
    this._ll = db.loadList;
    this._todoCheckedStatus = db.todoCheckedStatus;
    this._changeLanguage = db.changeLanguage;
    this._changeAppearance = db.changeAppearance;
  }
  LoadLists(element, document, jsonData = null) {
    jsonData ||= this._lls();
    jsonData.forEach((list) => {
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
      li.classList.add("color-" + list.listColor);
      span.classList.add("color-" + list.listColor);
      li.onclick = this.loadList(list.listID, document);
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
    });
  }

  #getColor(ColorID) {
    switch (ColorID) {
      case "red":
        return "#E25757";
      case "green":
        return "#2FC43E";
      case "blue":
        return "#5FA4FF";
      case "purple":
        return "#A766D3";
      case "orange":
        return "#FC9B2D";
      case "pink":
        return "#FF5DF1";
      default:
        return "#7366D3";
    }
  }

  loadList(listID, document) {
    let jsonData = this._ll(listID);
    // set things
    document.getElementById("list-name").innerText = jsonData.listName;
    document.getElementById("add-input").dataset.listid = jsonData.listID;
    document.getElementById("title").style.backgroundColor = this.#getColor(
      jsonData.listColor
    );
    // load todolist
    let todoList = document.getElementById("todolist");

    jsonData.listItems.forEach((todoItem) => {
      let frag = document.createDocumentFragment();
      let input = document.createElement("input");
      let label = document.createElement("label");

      input.type = "checkbox";
      input.id = todoItem.itemID;
      input.dataset.listid = listID;
      input.checked = todoItem.checked;
      label.setAttribute("for", todoItem.itemID);
      label.innerText = todoItem.itemName;

      frag.appendChild(input);
      frag.appendChild(label);
      todoList.appendChild(frag);
    });
  }

  search(v, doc, ele) {
    let jsonData = this._lls();
    let value = v.toLowerCase().trim();
    const result = jsonData.filter((data) => {
      return Object.keys(data).some((key) => {
        return JSON.stringify(data[key]).toLowerCase().trim().includes(value);
      });
    });
    this.LoadLists(ele, doc, result);
  }
}

module.exports = Events;
