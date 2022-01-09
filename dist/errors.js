"use strict";
exports.__esModule = true;
exports.handleError = void 0;
function handleError(message) {
    console.log(message);
    // put them into sentry
    process.exit(7);
}
exports.handleError = handleError;
