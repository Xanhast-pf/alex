// @flow
import weather from 'weather-js';
import firstEntityValue from 'tools/firstEntityValue';
import { textMessage, listTemplate } from 'tools/formatMessage';

type Context = {
    forecast?: string,
    askLocation?: string,
    missingLocation?: boolean
};

type Entity = {
    location?: string,
    intent?: 'weather'
};

export type Props = {
    context: ?Context,
    entities: Entity
};

const getForecast = ({ context, entities }: Props): Promise<Context> => {
    return new Promise((resolve) => {
        const location: ?string = firstEntityValue(entities, 'location');

        if (location) {
            new Promise((resolve) => {
                weather.find({ search: location, degreeType: 'C' }, (err, result) => {
                    if (err) {
                        const error = textMessage('Sorry I couldn\'t find it...');
                        return resolve(error);
                    } else {
                        return resolve(result);
                    }
                });
            }).then((val) => {
                context = {};
                if (typeof val === 'string') {
                    context.forecast = val;
                } else {
                    const elements = val.map((args) => {
                        return {
                            title: args.current.observationpoint,
                            item_url: args.current.imageUrl,
                            image_url: args.current.imageUrl,
                            subtitle: `Weather: ${ args.current.skytext }, Temperature: ${ args.current.temperature }°C`,
                            buttons: [
                                {
                                    title: 'View',
                                    type: 'web_url',
                                    url: args.current.imageUrl
                                }
                            ]
                        };
                    });

                    context.forecast = listTemplate(elements);
                }

                return resolve(context);
            });
        } else {
            context = {};
            context.missingLocation = true;
            context.askLocation = JSON.stringify({ text: 'Can you tell me the location please?' });
            return resolve(context);
        }
    });
};

export default getForecast;
