const path = require('path');

function resolve(relPath) {
  return path.resolve(__dirname, relPath);
}

module.exports = {
  projectRoot: __dirname,
  dataRoot: resolve("data"),
  supportEmail: "iliakan@javascript.ru"
};

