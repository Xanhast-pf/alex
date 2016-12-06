'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _firstEntityValue = require('../tools/firstEntityValue');

var _firstEntityValue2 = _interopRequireDefault(_firstEntityValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ShowOffers = function ShowOffers(_ref) {
    var context = _ref.context,
        entities = _ref.entities;

    return new Promise(function (resolve) {
        var intent = (0, _firstEntityValue2.default)(entities, 'intent');

        if (intent === 'show_offers') {
            // Check for offers nearby by default
            context = {};
            context.offers = '[ 2 for 1 beer at Chez Serge | 50% off on pink hearted boxers at Sears | Bananas for free if you buy a computer at La Source ]';
        } else {
            context = {};
        }
        return resolve(context);
    });
};
exports.default = ShowOffers;