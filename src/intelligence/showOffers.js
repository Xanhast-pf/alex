// @flow
import firstEntityValue from 'tools/firstEntityValue';
import { listTemplate } from 'tools/formatMessage';

type Context = {
    offers?: string,
    quickreplies?: string
};

type Entity = {
    location?: string,
    intent?: 'show_nearby_offers'
};

export type Props = {
    context: ?Context,
    entities: Entity
};

const ShowOffers = ({ context, entities }: Props): Promise<Context> => {
    return new Promise((resolve) => {
        const intent: ?string = firstEntityValue(entities, 'intent');

        if (intent === 'show_offers') { // Check for offers nearby by default
            context = {};
            const elements = [
                {
                    title: 'Chez Serge',
                    item_url: 'http://placehold.it/1024x1024',
                    image_url: 'http://placehold.it/1024x1024',
                    subtitle: '2 for 1 beer!'
                },
                {
                    title: 'Sears',
                    item_url: 'http://placehold.it/1024x1024',
                    image_url: 'http://placehold.it/1024x1024',
                    subtitle: '50% off on pink hearted boxers!'
                },
                {
                    title: 'La Source',
                    item_url: 'http://placehold.it/1024x1024',
                    image_url: 'http://placehold.it/1024x1024',
                    subtitle: 'Bananas for free if you buy a computer!'
                }
            ];

            context.offers = listTemplate(elements);
        } else {
            context = {};
        }
        return resolve(context);
    });
};

export default ShowOffers;
