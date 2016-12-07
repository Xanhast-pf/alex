// @flow
import weather from 'weather-js';
import firstEntityValue from 'tools/firstEntityValue';

type Context = {
    forecast?: string,
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
                        // const res: Object = result.map((args) => {
                        //     // return `Location : ${ args.current.observationpoint } | Sky : ${ args.current.skytext } | Temperature : ${ args.current.temperature } C`;
                        //     return args.current;
                        // });

                        return resolve(result);
                    }
                });
            }).then((val) => {
                context = {};
                if (typeof val === 'string') {
                    context.forecast = JSON.stringify(val);
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
            return resolve(context);
        }
    });
};

export default getForecast;
