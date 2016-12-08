// @flow
import firstEntityValue from 'tools/firstEntityValue';
import { listTemplate } from 'tools/formatMessage';
import type { Element } from 'types';

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
            const elements: Array<Element> = [
                {
                    title: 'Chez Serge',
                    item_url: 'https://s3.amazonaws.com/jogogo-static-file/chezserge/en-CA/assets/images/bgHeaderNoTxt.jpg',
                    image_url: 'https://s3.amazonaws.com/jogogo-static-file/chezserge/en-CA/assets/images/bgHeaderNoTxt.jpg',
                    subtitle: '2 for 1 beer!',
                    buttons: [
                        {
                            title: 'View Offer',
                            type: 'web_url',
                            url: 'https://s3.amazonaws.com/jogogo-static-file/chezserge/en-CA/assets/images/bgHeaderNoTxt.jpg'
                        }
                    ]
                },
                {
                    title: 'Studio M & W',
                    item_url: 'https://s3.amazonaws.com/jogogo-static-file/mwstudio/en-CA/assets/images/bgHeaderNoTxt.jpg',
                    image_url: 'https://s3.amazonaws.com/jogogo-static-file/mwstudio/en-CA/assets/images/bgHeaderNoTxt.jpg',
                    subtitle: 'Shave your head for free!',
                    buttons: [
                        {
                            title: 'Make me bald Please',
                            type: 'web_url',
                            url: 'https://s3.amazonaws.com/jogogo-static-file/mwstudio/en-CA/assets/images/bgHeaderNoTxt.jpg'
                        }
                    ]
                },
                {
                    title: '12345678901234567890123456789012345678901234567890123456789012345678901234567890KKKK',
                    item_url: 'https://s3.amazonaws.com/jogogo-static-file/corona/en-CA/assets/images/bgHeaderNoTxt.jpg',
                    image_url: 'https://s3.amazonaws.com/jogogo-static-file/corona/en-CA/assets/images/bgHeaderNoTxt.jpg',
                    subtitle: 'Bananas for free if you buy and finish a QuadraBurger!',
                    buttons: [
                        {
                            title: 'View Offer',
                            type: 'web_url',
                            url: 'https://s3.amazonaws.com/jogogo-static-file/corona/en-CA/assets/images/bgHeaderNoTxt.jpg'
                        }
                    ]
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
