document.getElementById("title").style.backgroundColor = decodeURI(
  window.location.href.split("#")[1]
);

(function () {
  languageSelectPrep();
})();
// eslint-disable-next-line no-unused-vars
function goBack() {
  let body = document.body;
  setTimeout(function () {
    if (body.classList.contains("animated")) {
      console.log("navigating..");
      window.location = "index.html";
    }
  }, 100);
  body.classList.add("animated");
}


// eslint-disable-next-line no-unused-vars
function scrollToDiv(id) {
  document.getElementById("sections").scrollTop =
    document.getElementById(id).offsetTop - 35;
}

function languageSelectPrep() {
  const languages = require("../localization/meta.json");
  let select = document.getElementById("language");
  let customSelect = document.getElementById("language_2");
  Object.keys(languages.languages).forEach((element) => {
    let option = document.createElement("option");
    option.text = languages.languages[element];
    option.value = element;
    if (getLanguage().split("-")[0] === element)
      document.getElementById("language_trigger").innerText =
        languages.languages[element];
    select.add(option);
    // add selectCustom-option
    let customOption = document.createElement("div");
    customOption.classList.add("selectCustom-option");
    customOption.dataset.value = element;
    customOption.innerText = languages.languages[element];
    customSelect.append(customOption);
  });
}
