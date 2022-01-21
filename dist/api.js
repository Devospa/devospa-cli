"use strict";
exports.__esModule = true;
exports.fileUpload = exports.signIn = exports.checkProject = void 0;
var got_1 = require("got");
var consts_1 = require("./consts");
var errors_1 = require("./errors");
var login_1 = require("./login");
var ApiUrl = "".concat(consts_1.baseURL, "/devospaApi");
function post(url, json) {
    return got_1["default"].post(ApiUrl + url, { json: json }).json()["catch"](function (err) {
        if (err.code === 'ECONNREFUSED') {
            (0, errors_1.handleError)("Devospa is out of service, please try again");
        }
        if (err.response.statusCode === 503) {
            return (0, login_1.login)().then(function () {
                return post(url, json);
            })["catch"](function (e) {
                (0, errors_1.handleError)("Please login again using the folowing command, npx devospa login");
            });
        }
        throw err;
    });
}
function checkProject(userToken, projectToken) {
    return post('/checkProjectToken', { projectToken: projectToken, userToken: userToken })["catch"](function (err) {
        (0, errors_1.handleError)("The project token is wrong, please copy the command from devospa.com");
    });
}
exports.checkProject = checkProject;
function signIn(email, password) {
    return post('/loginUser', { email: email, password: password }).then(function (v) { return v; })["catch"](function (err) {
        (0, errors_1.handleError)("Email or password is wrong, please use the email you registered with in devospa.com");
    });
}
exports.signIn = signIn;
function fileUpload(body, headers, onProgress) {
    return got_1["default"]
        .post(ApiUrl + '/upload', { body: body, headers: headers })
        .on("uploadProgress", onProgress);
}
exports.fileUpload = fileUpload;
