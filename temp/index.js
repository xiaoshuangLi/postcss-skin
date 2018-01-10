'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.default = function () {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (window === undefined || document === undefined) {
    return null;
  }

  if (!style) {
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    document.head.appendChild(style);
  }

  var res = (0, _values2.default)(others).join('');

  (0, _keys2.default)(obj).forEach(function (key) {
    var value = obj[key] || '';
    var reg = new RegExp('' + prefix + key, 'g');

    res = res.replace(reg, value);
  });

  res = res.replace(prefix, '');

  style.innerHTML = res;
};

var _temp = require('./temp');

var _temp2 = _interopRequireDefault(_temp);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var prefix = _temp2.default.prefix,
    others = (0, _objectWithoutProperties3.default)(_temp2.default, ['prefix']);

var style = void 0;

;