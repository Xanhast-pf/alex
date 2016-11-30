// @flow
'use strict';

import weather from 'weather-js';

let Wit = null;
let interactive = null;
try {
  // if running from repo
    Wit = require('../').Wit;
    interactive = require('../').interactive;
} catch (e) {
    Wit = require('node-wit').Wit;
    interactive = require('node-wit').interactive;
}

// const accessToken = (() => {
//   if (process.argv.length !== 3) {
//     console.log('usage: node examples/quickstart.js <wit-access-token>');
//     process.exit(1);
//   }
//   return process.argv[2];
// })();

// const accessToken = 'NES67P6A4AVRL557TOCTZBLFL2UUINC4'; // SUNNY
const accessToken = '4737MR7N7PQAEAXHGHPBDGCWNC6LUCKN'; // ALEX

// Quickstart example
// See https://wit.ai/ar7hur/quickstart

const firstEntityValue = (entities, entity) => {
    const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
    if (!val) {
        return null;
    }
    return typeof val === 'object' ? val.value : val;
};

const actions = {
    send(request, response) {
        const { sessionId, context, entities } = request;
        const { text, quickreplies } = response;
        return new Promise((resolve) => {
            console.log('Alex: ', JSON.stringify(response));
            return resolve();
        });
    },
    getForecast({ context, entities }) {
        return new Promise((resolve) => {
            const location = firstEntityValue(entities, 'location');
            if (location) {
                new Promise((resolve) => {
                    weather.find({ search: location, degreeType: 'C' }, (err, result) => {
                        if (err) {
                            return resolve('Sorry I couldn\'t find it...');
                        } else {
                            const res = result.map((args) => {
                                return `Location : ${ args.current.observationpoint } | Sky : ${ args.current.skytext } | Temperature : ${ args.current.temperature } C`;
                            });
                            return resolve(res);
                        }
                    });
                }).then((val) => {
                    context.forecast = val;
                    delete context.missingLocation;
                    return resolve(context);
                });
            } else {
                context.missingLocation = true;
                delete context.forecast;
                return resolve(context);
            }
        });
    },
    Greet({ context, entities }) {
        return new Promise((resolve) => {
            const intent = firstEntityValue(entities, 'intent');
            if (intent === 'greetings') {
                context.greetings = 'Greetings Master! It would be an honor to serve you today!';
            } else {
                delete context.greetings;
            }
            return resolve(context);
        });
    },
    findTheater({ context, entities }) {
        return new Promise((resolve) => {
            const intent = firstEntityValue(entities, 'findTheater');
            const movie = firstEntityValue(entities, 'movie');

            if (intent === 'findTheater') {
                context.theater = 'Looking for availability for : ' + movie;
            } else {
                delete context.theater;
            }
            return resolve(context);
        });
    }
};

const client = new Wit({ accessToken, actions });
interactive(client);
