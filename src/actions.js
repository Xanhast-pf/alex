// @flow
import type { Props as GetForecastProps } from 'intelligence/forecast';
import GetForecast from 'intelligence/forecast';

import type { Props as GreetProps } from 'intelligence/greet';
import Greet from 'intelligence/greet';

import type { Props as PositiveAnswerProps } from 'intelligence/positiveAnswer';
import PositiveAnswer from 'intelligence/positiveAnswer';

import ShowOffers from 'intelligence/showOffers';
import type { Props as ShowOffersProps } from 'intelligence/showOffers';
// import { interactive, Wit } from 'node-wit';

const customActions = {
    getForecast({ context, entities }: GetForecastProps) {
        return GetForecast({ context, entities });
    },
    showOffers({ context, entities }: ShowOffersProps) {
        return ShowOffers({ context, entities });
    },
    greet({ context, entities }: GreetProps) {
        return Greet({ context, entities });
    },
    positiveAnswer({ context, entities }: PositiveAnswerProps) {
        return PositiveAnswer({ context, entities });
    }
};

type Request = {
    sessionId: string,
    context: Object,
    entities: Object
};

type Response = {
    text: Object,
    quickreplies: Object
};

const actions = {
    send(request: Request, response: Response) {
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
// // Test actions -> execute actions.js in console
// const accessToken = '4737MR7N7PQAEAXHGHPBDGCWNC6LUCKN'; // ALEX
// const client = new Wit({ accessToken, actions });
// interactive(client);
