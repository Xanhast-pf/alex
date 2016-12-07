// @flow
import firstEntityValue from 'tools/firstEntityValue';

type Context = {
    offers?: string,
    quickreplies?: string
};

type Entity = {
    intent?: 'greetings'
};

export type Props = {
    context: ?Context,
    entities: Entity
};

const Greet = ({ context, entities }: Props): Promise<Context> => {
    return new Promise((resolve) => {
        const intent = firstEntityValue(entities, 'intent');
        if (intent === 'greetings') {
            context = {};
            context.greetings = 'Greetings Master! It would be an honor to serve you today!';
        } else {
            context = {};
        }
        return resolve(context);
    });
};

export default Greet;
