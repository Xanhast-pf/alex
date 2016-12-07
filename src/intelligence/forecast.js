// @flow
import weather from 'weather-js';
import firstEntityValue from 'tools/firstEntityValue';

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
                        const error = JSON.stringify({ text: 'Sorry I couldn\'t find it...' });
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
                            subtitle: args.current.skytext
                        };
                    });

                    const format = {
                        attachment: {
                            type: 'template',
                            payload: {
                                template_type: 'generic',
                                elements
                            }
                        }
                    };
                    context.forecast = JSON.stringify(format);
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
