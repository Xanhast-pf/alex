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

type Props = {
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
                        return resolve('Sorry I couldn\'t find it...');
                    } else {
                        const res: string = result.map((args) => {
                            return `Location : ${ args.current.observationpoint } | Sky : ${ args.current.skytext } | Temperature : ${ args.current.temperature } C`;
                        });
                        return resolve(res);
                    }
                });
            }).then((val) => {
                context = {};
                context.forecast = val;
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
