// @flow
// import googleMapsClient from '@google/maps';
import firstEntityValue from 'tools/firstEntityValue';

import type { Props as GetForecastProps } from 'intelligence/forecast';
import GetForecast from 'intelligence/forecast';

import ShowOffers from 'intelligence/showOffers';
import type { Props as ShowOffersProps } from 'intelligence/showOffers';
// import { interactive, Wit } from 'node-wit';
//
// const accessToken = '4737MR7N7PQAEAXHGHPBDGCWNC6LUCKN'; // ALEX

// const key = 'AIzaSyC9Rg5wNEWEgQETU1odVqEERl49MRbPfWQ'; // Google Map API key
// googleMapsClient.createClient({ key });

// Quickstart example
// See https://wit.ai/ar7hur/quickstart


const customActions = {
    getForecast({ context, entities }: GetForecastProps) {
        return GetForecast({ context, entities });
    },
    showOffers({ context, entities }: ShowOffersProps) {
        return ShowOffers({ context, entities });
    },
    Greet({ context, entities }) {
        return new Promise((resolve) => {
            const intent = firstEntityValue(entities, 'intent');
            if (intent === 'greetings') {
                context = {};
                context.greetings = 'Greetings Master! It would be an honor to serve you today!';
            } else {
                context = {};
            }
            return resolve(context);
        });
    },
    findTheater({ context, entities }) {
        return new Promise((resolve) => {
            const intent = firstEntityValue(entities, 'findTheater');
            const movie = firstEntityValue(entities, 'movie');

            if (intent === 'findTheater' && movie) {
                context = {};
                context.theater = `Looking for availability for: ${ movie }`;
            } else {
                context = {};
            }
            return resolve(context);
        });
    },
    positiveAnswer({ context, entities }) {
        return new Promise((resolve) => {
            const sentiment = firstEntityValue(entities, 'sentiment');

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

const actions = {
    send(request, response) {
        // const { sessionId, context, entities } = request;
        // const { text, quickreplies } = response;

        return new Promise((resolve) => {
            response.text && console.log('Alex: ', response.text);
            return resolve();
        });
    },
    ...customActions
};

export {
    actions,
    customActions
};
// // Test actions -> execute entry.js in console
// const client = new Wit({ accessToken, actions });
// interactive(client);
