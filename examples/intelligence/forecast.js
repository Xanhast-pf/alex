// @flow
import weather from 'weather-js';
import firstEntityValue from 'tools/firstEntityValue';

type Props = {
    context: Object,
    entities: Object
};

const getForecast = ({ context, entities }: Props) => {
    return new Promise((resolve) => {
        const location = firstEntityValue(entities, 'location');
        if (location) {
            new Promise((resolve) => {
                weather.find({ search: location, degreeType: 'C' }, (err, result) => {
                    if (err) {
                        return resolve('Sorry I couldn\'t find it...');
                    } else {
                        const res = result.map((args) => {
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
