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
                    item_url: 'https://s3.amazonaws.com/jogogo-static-file/chezserge/en-CA/assets/images/bgHeaderNoTxt.jpg',
                    image_url: 'imageUrl": "https://s3.amazonaws.com/jogogo-static-file/corona/en-CA/assets/images/fullscreenSilverPrize.jpg',
                    subtitle: '2 for 1 beer!'
                },
                {
                    title: 'Studio M & W',
                    item_url: 'https://s3.amazonaws.com/jogogo-static-file/mwstudio/en-CA/assets/images/bgHeaderNoTxt.jpg',
                    image_url: 'https://s3.amazonaws.com/jogogo-static-file/corona/en-CA/assets/images/fullscreenSilverPrize.jpg',
                    subtitle: 'Shave your head for free!'
                },
                {
                    title: 'Burger Crise Cardiaque',
                    item_url: 'https://s3.amazonaws.com/jogogo-static-file/corona/en-CA/assets/images/bgHeaderNoTxt.jpg',
                    image_url: 'https://s3.amazonaws.com/jogogo-static-file/corona/en-CA/assets/images/bgHeaderNoTxt.jpg',
                    subtitle: 'Bananas for free if you buy and finish a QuadraBurger!'
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
