"use strict";
exports.__esModule = true;
exports.storeData = exports.readStoredData = exports.getStoreFilePath = void 0;
var fs = require("fs");
var path = require("path");
function getStoreFilePath() {
    var appDir = path.dirname(require.main.filename);
    return path.join(appDir, "/stores.json");
}
exports.getStoreFilePath = getStoreFilePath;
function readStoredData() {
    try {
        return require(getStoreFilePath());
    }
    catch (e) {
        return {};
    }
}
exports.readStoredData = readStoredData;
function storeData(json) {
    fs.writeFile(getStoreFilePath(), JSON.stringify(json), function (err) { });
}
exports.storeData = storeData;
