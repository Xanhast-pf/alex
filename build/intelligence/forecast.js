'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _weatherJs = require('weather-js');

var _weatherJs2 = _interopRequireDefault(_weatherJs);

var _firstEntityValue = require('../tools/firstEntityValue');

var _firstEntityValue2 = _interopRequireDefault(_firstEntityValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getForecast = function getForecast(_ref) {
    var context = _ref.context,
        entities = _ref.entities;

    return new Promise(function (resolve) {
        var location = (0, _firstEntityValue2.default)(entities, 'location');

        if (location) {
            new Promise(function (resolve) {
                _weatherJs2.default.find({ search: location, degreeType: 'C' }, function (err, result) {
                    if (err) {
                        return resolve('Sorry I couldn\'t find it...');
                    } else {
                        var res = result.map(function (args) {
                            return 'Location : ' + args.current.observationpoint + ' | Sky : ' + args.current.skytext + ' | Temperature : ' + args.current.temperature + ' C';
                        });
                        return resolve(res);
                    }
                });
            }).then(function (val) {
                context = {};
                context.forecast = val;
                return resolve(context);
            });
        } else {
            context = {};
            context.missingLocation = true;
            return resolve(context);
        }
    });
};

exports.default = getForecast;