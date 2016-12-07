// @flow
import { FB_PAGE_TOKEN } from 'config';
import fetch from 'node-fetch';

const fbMessage = (id: string, message: Object) => {
    const body = JSON.stringify({
        recipient: { id },
        message
    });

    const qs = 'access_token=' + encodeURIComponent(FB_PAGE_TOKEN);

    return fetch('https://graph.facebook.com/me/messages?' + qs, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
    })
      .then(rsp => rsp.json())
      .then((json) => {
          if (json.error && json.error.message) {
              throw new Error(json.error.message);
          }
          return json;
      });
};

const fbGenericTemplate = (id: string, imageUrl: string) => {
    const body = JSON.stringify({
        recipient: { id },
        imageUrl,
        message: {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    elements: [
                        {
                            title: 'Welcome to Peter\'s Hats',
                            item_url: 'https://petersfancybrownhats.com',
                            image_url: 'https://petersfancybrownhats.com/company_image.png',
                            subtitle: 'We\'ve got the right hat for everyone.',
                            buttons: [
                                {
                                    type: 'web_url',
                                    url: 'https://petersfancybrownhats.com',
                                    title: 'View Website'
                                },
                                {
                                    type: 'postback',
                                    title: 'Start Chatting',
                                    payload: 'DEVELOPER_DEFINED_PAYLOAD'
                                }
                            ]
                        }
                    ]
                }
            }
        }
    });

    const qs = 'access_token=' + encodeURIComponent(FB_PAGE_TOKEN);

    return fetch('https://graph.facebook.com/me/messages?' + qs, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
    })
      .then(rsp => rsp.json())
      .then((json) => {
          if (json.error && json.error.message) {
              throw new Error(json.error.message);
          }
          return json;
      });
};

export {
    fbMessage,
    fbGenericTemplate
};
