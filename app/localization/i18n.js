const path = require("path");
const fs = require("fs");
let loadedLanguage;

module.exports = i18n;

function i18n(lang) {
  if (fs.existsSync(path.join(__dirname, "locales", lang + ".json"))) {
    loadedLanguage = JSON.parse(
      fs.readFileSync(path.join(__dirname, "locales", lang + ".json"), "utf8")
    );
  } else {
    loadedLanguage = JSON.parse(
      fs.readFileSync(path.join(__dirname, "locales", "en.json"), "utf8")
    );
  }
}

i18n.prototype.__ = function (phrase) {
  let translation = loadedLanguage[phrase];
  if (translation === undefined) {
    translation = phrase;
  }
  return translation;
};
