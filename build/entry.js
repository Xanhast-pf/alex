'use strict';

var _firstEntityValue = require('./tools/firstEntityValue');

var _firstEntityValue2 = _interopRequireDefault(_firstEntityValue);

var _forecast = require('./intelligence/forecast');

var _forecast2 = _interopRequireDefault(_forecast);

var _showOffers = require('./intelligence/showOffers');

var _showOffers2 = _interopRequireDefault(_showOffers);

var _nodeWit = require('node-wit');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import googleMapsClient from '@google/maps';
var accessToken = '4737MR7N7PQAEAXHGHPBDGCWNC6LUCKN'; // ALEX

// const key = 'AIzaSyC9Rg5wNEWEgQETU1odVqEERl49MRbPfWQ'; // Google Map API key
// googleMapsClient.createClient({ key });

// Quickstart example
// See https://wit.ai/ar7hur/quickstart

var actions = {
    send: function send(request, response) {
        // const { sessionId, context, entities } = request;
        // const { text, quickreplies } = response;

        return new Promise(function (resolve) {
            response.text && console.log('Alex: ', response.text);
            return resolve();
        });
    },
    getForecast: function getForecast(_ref) {
        var context = _ref.context,
            entities = _ref.entities;

        return (0, _forecast2.default)({ context: context, entities: entities });
    },
    showOffers: function showOffers(_ref2) {
        var context = _ref2.context,
            entities = _ref2.entities;

        return (0, _showOffers2.default)({ context: context, entities: entities });
    },
    Greet: function Greet(_ref3) {
        var context = _ref3.context,
            entities = _ref3.entities;

        return new Promise(function (resolve) {
            var intent = (0, _firstEntityValue2.default)(entities, 'intent');
            if (intent === 'greetings') {
                context = {};
                context.greetings = 'Greetings Master! It would be an honor to serve you today!';
            } else {
                context = {};
            }
            return resolve(context);
        });
    },
    findTheater: function findTheater(_ref4) {
        var context = _ref4.context,
            entities = _ref4.entities;

        return new Promise(function (resolve) {
            var intent = (0, _firstEntityValue2.default)(entities, 'findTheater');
            var movie = (0, _firstEntityValue2.default)(entities, 'movie');

            if (intent === 'findTheater' && movie) {
                context = {};
                context.theater = 'Looking for availability for: ' + movie;
            } else {
                context = {};
            }
            return resolve(context);
        });
    },
    positiveAnswer: function positiveAnswer(_ref5) {
        var context = _ref5.context,
            entities = _ref5.entities;

        return new Promise(function (resolve) {
            var sentiment = (0, _firstEntityValue2.default)(entities, 'sentiment');

            if (sentiment === 'positive') {
                context = {};
                context.sentiment = 'That makes me happy!';
            } else {
                context = {};
                context.sentiment = 'I really don\'t know what to say...';
            }
            return resolve(context);
        });
    }
};

var client = new _nodeWit.Wit({ accessToken: accessToken, actions: actions });
(0, _nodeWit.interactive)(client);