"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.upload = void 0;
var rimraf = require("rimraf");
var FormData = require("form-data");
var fs = require("fs");
var cliProgress = require("cli-progress");
var zip_a_folder_1 = require("zip-a-folder");
var store_1 = require("./store");
var errors_1 = require("./errors");
var api_1 = require("./api");
var concat = require('concat-stream');
var progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
function upload(buildFolder) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, userToken, tags, projectToken, tagSp, zipFileName, fd, cs;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = (0, store_1.readStoredData)(), userToken = _a.userToken, tags = _a.tags, projectToken = _a.projectToken;
                    // Compresses the build folder
                    if (!userToken || !projectToken) {
                        return [2 /*return*/, (0, errors_1.handleError)('upload unable to access userToken')];
                    }
                    tagSp = tags.replace('#', '-');
                    zipFileName = "./" + tagSp + projectToken + ".zip";
                    return [4 /*yield*/, (0, zip_a_folder_1.zip)(buildFolder, zipFileName)
                        // Creates a FormData and merge the zip file into it
                    ];
                case 1:
                    _b.sent();
                    fd = new FormData();
                    fd.append("token", projectToken);
                    fd.append("tags", tags);
                    fd.append("userToken", userToken);
                    fd.append("file", fs.createReadStream(zipFileName));
                    cs = concat({ encoding: "buffer" }, function (data) {
                        if (!data) {
                            return (0, errors_1.handleError)("Errored at buffering");
                        }
                        progressBar.start(100, 1);
                        return (0, api_1.fileUpload)(data, fd.getHeaders(), function (_a) {
                            var percent = _a.percent;
                            progressBar.update(Math.round(percent * 100));
                        }).then(function (uploadResponse) {
                            progressBar.stop();
                            console.log("Upload completed, Please check devospa.com");
                        })["catch"](function (e) {
                            progressBar.stop();
                            return (0, errors_1.handleError)("Sorry but uploading the zip file errored, Please try again in a few second");
                        })["finally"](function () {
                            // Removes the zip file
                            rimraf(zipFileName, function (e) {
                                e && console.log(e);
                                console.log("Removed created zip file");
                                process.exit();
                            });
                        });
                    });
                    fd.pipe(cs);
                    return [2 /*return*/];
            }
        });
    });
}
exports.upload = upload;
