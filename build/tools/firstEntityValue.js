'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var firstEntityValue = function firstEntityValue(entities, entity) {
    var val = entities && entities[entity] && Array.isArray(entities[entity]) && entities[entity].length > 0 && entities[entity][0].value;
    if (!val) {
        return null;
    }
    return (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' ? val.value : val;
};

exports.default = firstEntityValue;