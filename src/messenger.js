// flow
import { WIT_TOKEN, FB_APP_SECRET, PORT, FB_VERIFY_TOKEN } from 'config';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import express from 'express';
import { log, Wit } from 'node-wit';
import { customActions } from './actions';

// crypto.randomBytes(8, (err, buff) => {
//     if (err) throw err;
//     FB_VERIFY_TOKEN = buff.toString('hex');
//     console.log(`/webhook will accept the Verify Token "${FB_VERIFY_TOKEN}"`);
// });

// ----------------------------------------------------------------------------
// Messenger API specific code

// See the Send API reference
// https://developers.facebook.com/docs/messenger-platform/send-api-reference
import { fbMessage, fbTyping } from 'tools/facebookMessage';

// ----------------------------------------------------------------------------
// Wit.ai bot specific code

// This will contain all user sessions.
// Each session has an entry:
// sessionId -> {fbid: facebookUserId, context: sessionState}
const sessions = {};

const findOrCreateSession = (fbid) => {
    let sessionId;
  // Let's see if we already have a session for the user fbid
    Object.keys(sessions).forEach((k) => {
        if (sessions[k].fbid === fbid) {
      // Yep, got it!
            sessionId = k;
        }
    });
    if (!sessionId) {
    // No session found for user fbid, let's create a new one
        sessionId = new Date().toISOString();
        sessions[sessionId] = { fbid: fbid, context: {}};
    }
    return sessionId;
};

// Our bot actions
const actions = {
    send({ sessionId }, { text }) {
    // Our bot has something to say!
    // Let's retrieve the Facebook user whose session belongs to
        const recipientId = sessions[sessionId].fbid;
        if (recipientId) {
      // Yay, we found our recipient!
      // Let's forward our bot response to her.
      // We return a promise to let our bot know when we're done sending
            return fbMessage(recipientId, JSON.parse(text))
                .then(() => null)
                .catch((err) => {
                    console.error(
                        'Oops! An error occurred while forwarding the response: ', JSON.parse(text), ' to',
                        recipientId,
                        ':',
                        err.stack || err
                    );
                });
        } else {
            console.error('Oops! Couldn\'t find user for session:', sessionId);
      // Giving the wheel back to our bot
            return Promise.resolve();
        }
    },
  // You should implement your custom actions here
  // See https://wit.ai/docs/quickstart
    ...customActions
};

// Setting up our bot
const wit = new Wit({
    accessToken: WIT_TOKEN,
    actions,
    logger: new log.Logger(log.INFO)
});

// Starting our webserver and putting it all together
const app = express();
app.use(({ method, url }, rsp, next) => {
    rsp.on('finish', () => {
        console.log(`${ rsp.statusCode } ${ method } ${ url }`);
    });
    next();
});
app.use(bodyParser.json({ verify: verifyRequestSignature }));

// Webhook setup
app.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === FB_VERIFY_TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.sendStatus(400);
    }
});

// Message handler
app.post('/webhook', (req, res) => {
  // Parse the Messenger payload
  // See the Webhook reference
  // https://developers.facebook.com/docs/messenger-platform/webhook-reference
    const data = req.body;

    if (data.object === 'page') {
        data.entry.forEach((entry) => {
            entry.messaging.forEach((event) => {
                if (event.message && !event.message.is_echo) {
          // Yay! We got a new message!
          // We retrieve the Facebook user ID of the sender
                    const sender = event.sender.id;

          // We retrieve the user's current session, or create one if it doesn't exist
          // This is needed for our bot to figure out the conversation history
                    const sessionId = findOrCreateSession(sender);

          // We retrieve the message content
                    const { text, attachments } = event.message;

                    if (attachments) {
            // We received an attachment
            // Let's reply with an automatic message
                        // const oui = [{
                        //     title: 'Jonathan\'s Location',
                        //     url: 'ui',
                        //     type: 'location',
                        //     payload: {
                        //         coordinates: {
                        //             lat: 45.525984,
                        //             long: -73.595397
                        //         }
                        //     }
                        // }];

                        fbTyping(sender, 'mark_seen')
                            .catch(console.error);
                        fbTyping(sender, 'typing_on')
                            .catch(console.error);

                        fbMessage(sender, { text: 'Sorry I can only process text messages for now.' })
                            .catch(console.error);

                        fbTyping(sender, 'typing_off')
                            .catch(console.error);
                    } else if (text) {
                        // We received a text message
                        fbTyping(sender, 'mark_seen')
                            .catch(console.error);
                        fbTyping(sender, 'typing_on')
                            .catch(console.error);
                        // Let's forward the message to the Wit.ai Bot Engine
                        // This will run all actions until our bot has nothing left to do
                        wit.runActions(
                            sessionId, // the user's current session
                            text, // the user's message
                            sessions[sessionId].context // the user's current session state
                        ).then((context) => {
                            fbTyping(sender, 'typing_off')
                                .catch(console.error);
                          // Our bot did everything it has to do.
                          // Now it's waiting for further messages to proceed.
                            console.log('Waiting for next user messages');

                          // Based on the session state, you might want to reset the session.
                          // This depends heavily on the business logic of your bot.
                          // Example:
                          // if (context['done']) {
                          //   delete sessions[sessionId];
                          // }

                          // Updating the user's current session state
                            sessions[sessionId].context = context;
                        })
                        .catch((err) => {
                            console.error('Oops! Got an error from Wit: ', err.stack || err);
                        });
                    }
                } else {
                    console.log('received event', JSON.stringify(event));
                }
            });
        });
    }
    res.sendStatus(200);
});

/*
 * Verify that the callback came from Facebook. Using the App Secret from
 * the App Dashboard, we can verify the signature that is sent with each
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
    var signature = req.headers['x-hub-signature'];

    if (!signature) {
    // For testing, let's log an error. In production, you should throw an
    // error.
        console.error('Couldn\'t validate the signature.');
    } else {
        var elements = signature.split('=');
        // var method = elements[0];
        var signatureHash = elements[1];

        var expectedHash = crypto.createHmac('sha1', FB_APP_SECRET)
                        .update(buf)
                        .digest('hex');

        if (signatureHash !== expectedHash) {
            throw new Error('Couldn\'t validate the request signature.');
        }
    }
}

app.listen(PORT);
console.log('Listening on :' + PORT + '...');
