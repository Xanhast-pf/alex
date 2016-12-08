// @flow
import type {
    Element,
    ListTemplate,
    GenericTemplate
} from 'types';

const textMessage = (text: string) => {
    return JSON.stringify({ text });
};

const genericTemplate = (elements: Array<Element>) => {
    const attachment: GenericTemplate = {
        type: 'template',
        payload: {
            template_type: 'generic',
            elements
        }
    };

    return JSON.stringify({ attachment });
};

const listTemplate = (elements: Array<Element>) => {
    if (elements.length >= 2 && elements.length <= 4) {
        const attachment: ListTemplate = {
            type: 'template',
            payload: {
                template_type: 'list',
                elements
            }
        };

        return JSON.stringify({ attachment });
    } else {
        return genericTemplate(elements);
    }
};

export {
    textMessage,
    genericTemplate,
    listTemplate
};
