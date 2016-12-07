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

export {
    fbMessage
};
