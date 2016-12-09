// @flow
import type {
    Element,
    ListTemplate,
    GenericTemplate,
    QuickReplies
} from 'types';

const textMessage = (text: string, quickReplies?: Array<QuickReplies>) => {
    if (quickReplies) {
        const formattedReplies = quickReplies.map((args) => {
            if (args.content_type === 'text') {
                if (args.title && args.title.length > 20) {
                    args.title = args.title.slice(0, 20);
                }

                if (args.payload && args.payload.length > 1000) {
                    args.payload = args.payload.slice(0, 1000);
                }
            }

            return args;
        });

        return JSON.stringify({
            text,
            quick_replies: formattedReplies
        });
    }

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

    formatButtonTitle(element);
};

const get1Button = (element: Element) => {
    if (element.buttons && element.buttons.length > 1) {
        element.buttons = element.buttons.slice(0, 1);
    }

    formatButtonTitle(element);
};

const formatTitle = (element: Element) => {
    if (element.title.length > 80) element.title = element.title.slice(0, 80);
};

const formatSubTitle = (element: Element) => {
    if (element.subtitle.length > 80) element.subtitle = element.subtitle.slice(0, 80);
};

const formatButtonTitle = (element: Element) => {
    if (element.buttons) {
        element.buttons.map((args) => {
            if (args.type === 'post_back' || args.type === 'web_url') {
                if (args.title.length > 20) {
                    args.title = args.title.slice(0, 20);
                }
            }
        });
    }
};

export {
    textMessage,
    genericTemplate,
    listTemplate
};
