// @flow
import firstEntityValue from 'tools/firstEntityValue';

type Context = {
    sentiment?: string,
    quickreplies?: string
};

type Entity = {
    intent?: 'sentiment'
};

export type Props = {
    context: ?Context,
    entities: Entity
};

const Greet = ({ context, entities }: Props): Promise<Context> => {
    return new Promise((resolve) => {
        const sentiment = firstEntityValue(entities, 'sentiment');

        if (sentiment === 'positive') {
            context = {};
            context.sentiment = 'That makes me happy!';
        } else {
            context = {};
            context.sentiment = 'I really don\'t know what to say...';
        }
        return resolve(context);
    });
};

export default Greet;
