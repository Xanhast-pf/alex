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
    if (elements.length > 10) {
        elements = elements.slice(0, 10); // Limited to 10 elements per template
    }

    elements.map((args) => {
        get3Buttons(args); // Generic templates accepts maximum 3 buttons per items
        formatTitle(args); // 80 chars max
        formatSubTitle(args); // 80 chars max
    });

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
        elements.map((args) => { // List template accepts only one button per item
            get1Button(args);
            formatTitle(args);
            formatSubTitle(args);
        });

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

const get3Buttons = (element: Element) => {
    if (element.buttons && element.buttons.length > 3) {
        element.buttons = element.buttons.slice(0, 3);
    }
};

const get1Button = (element: Element) => {
    if (element.buttons && element.buttons.length > 1) {
        element.buttons = element.buttons.slice(0, 1);
    }
};

const formatTitle = (element: Element) => {
    if (element.title.length > 80) element.title = element.title.slice(0, 80);
};

const formatSubTitle = (element: Element) => {
    if (element.subtitle.length > 80) element.subtitle = element.subtitle.slice(0, 80);
};

export {
    textMessage,
    genericTemplate,
    listTemplate
};
