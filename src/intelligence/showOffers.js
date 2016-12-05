// @flow
import firstEntityValue from 'tools/firstEntityValue';

type Context = {
    offers?: string
};

type Entity = {
    location?: string,
    intent?: 'show_nearby_offers'
};

type Props = {
    context: ?Context,
    entities: Entity
};

const ShowOffers = ({ context, entities }: Props): Promise<Context> => {
    return new Promise((resolve) => {
        const intent: ?string = firstEntityValue(entities, 'intent');

        if (intent === 'show_offers') { // Check for offers nearby by default
            context = {};
            context.offers = '[ 2 for 1 beer at Chez Serge | 50% off on pink hearted boxers at Sears | Bananas for free if you buy a computer at La Source ]';
        } else {
            context = {};
        }
        return resolve(context);
    });
};

export default ShowOffers;
