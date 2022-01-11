// eslint-disable-next-line no-unused-vars
function showPreferences() {
  let body = document.body;
  setTimeout(function () {
    if (body.classList.contains("navigating")) {
      console.log("navigating..");
      window.location =
        "preferences.html#" +
        document.getElementById("title").style.backgroundColor;
    }
  }, 100);
  body.classList.add("navigating");
}

function clearAnimated(elementID) {
  setTimeout(
    () => document.getElementById(elementID).classList.remove("animated"),
    300
  );
}

function showToDo() {
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
  taskAdd.onclick = showToDo;
  document.getElementById("task-input").classList.remove("bounceIn");

  document.getElementById("task-input").classList.add("bounceOut", "animated");
  document.getElementById("add-input").value = null;
  setTimeout(
    () => (document.getElementById("task-input").style.display = "none"),
    300
  );
  taskAdd.onclick = showToDo;
  clearAnimated("task-input");
}

document.getElementById("add-input").addEventListener("keyup", (event) => {
  if (event.key === "enter" || event.key === "Enter") {
    try {
      let input = document.getElementById("add-input");
      let todoList = document.getElementById("todolist");
      let frag = document.createDocumentFragment();
      let newInput = document.createElement("input");
      let label = document.createElement("label");

      newInput.type = "checkbox";
      newInput.id = Event.createToDo(input.value, input.dataset.listid);
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
  console.log("a");
  Event.search(
    event.target.value,
    document,
    document.getElementById("todolists")
  );
  // TODO: divin içerisini temizle ve içeriği gir
  // TODO: Search reset'e basıldığında içeriği sil listeleri yükle
});
