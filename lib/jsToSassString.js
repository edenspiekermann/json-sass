"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var isPlainObject = _interopRequire(require("lodash-node/modern/objects/isPlainObject"));

var Color = _interopRequire(require("color"));

var isArray = Array.isArray;


function jsToSassString(value) {
  function _jsToSassString(value) {
    var initialIndentLevel = arguments[1] === undefined ? 0 : arguments[1];
    var indentLevel = initialIndentLevel;

    switch (typeof value) {
      case "boolean":
      case "number":
        return value.toString();
      case "string":
        try {
          var color = Color(value);
          return value.toString();
        } catch (e) {
          if (/^[a-zA-Z0-9_-]+$/.test(value) == false) {
            return "\"" + value + "\"";
          }

          return value.toString();
        }
      case "object":
        if (isPlainObject(value)) {
          var _ret = (function () {
            indentLevel += 1;
            var indent = indentsToSpaces(indentLevel);

            var jsObj = value;
            var sassKeyValPairs = [];

            sassKeyValPairs = Object.keys(jsObj).reduce(function (result, key) {
              var jsVal = jsObj[key];
              var sassVal = _jsToSassString(jsVal, indentLevel);

              if (isNotUndefined(sassVal)) {
                result.push("\"" + key + "\": " + sassVal);
              }

              return result;
            }, []);

            var result = "(\n" + (indent + sassKeyValPairs.join(",\n" + indent)) + "\n" + indentsToSpaces(indentLevel - 1) + ")";
            indentLevel -= 1;
            return {
              v: result
            };
          })();

          if (typeof _ret === "object") {
            return _ret.v;
          }
        } else if (isArray(value)) {
          var sassVals = (function () {
            var _sassVals = [];

            for (var _iterator = value[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
              var v = _step.value;
              if (isNotUndefined(v)) {
                _sassVals.push(_jsToSassString(v, indentLevel));
              }
            }

            return _sassVals;
          })();

          return "(" + sassVals.join(", ") + ")";
        } else if (isNull(value)) {
          return "null";
        } else {
          return value.toString();
        }default:
        return;
    }
  }

  return _jsToSassString(value);
}

function indentsToSpaces(indentCount) {
  return Array(indentCount + 1).join("  ");
}

function isNull(value) {
  return value === null;
}

function isNotUndefined(value) {
  return typeof value !== "undefined";
}

module.exports = jsToSassString;
