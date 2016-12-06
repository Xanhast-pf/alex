'use strict';

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _nodeWit = require('node-wit');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Webserver parameter
// Messenger API integration example
// We assume you have:
// * a Wit.ai bot setup (https://wit.ai/docs/quickstart)
// * a Messenger Platform setup (https://developers.facebook.com/docs/messenger-platform/quickstart)
// You need to `npm install` the following dependencies: body-parser, express, request.
//
// 1. npm install body-parser express request
// 2. Download and install ngrok from https://ngrok.com/download
// 3. ./ngrok http 8445
// 4. WIT_TOKEN=your_access_token FB_APP_SECRET=your_app_secret FB_PAGE_TOKEN=your_page_token node examples/messenger.js
// 5. Subscribe your page to the Webhooks using verify_token and `https://<your_ngrok_io>/webhook` as callback URL.
// 6. Talk to your bot on Messenger!

var PORT = process.env.PORT || 8445;

// Wit.ai parameters
var WIT_TOKEN = process.env.WIT_TOKEN || '4737MR7N7PQAEAXHGHPBDGCWNC6LUCKN';

// Messenger API parameters
var FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN || 'EAATdQ9r4SSMBAHo1gDI910vazZCSP2GhDVA4KKZCTxwRhMzUGxZC75VRXsCNJnjo4bWnAjAYKZCyNQ6XRssKw8t598KugXpPCN5PPtQhkrgVyqUZAlV7t2iWrUjZA26w7g2vY3SfHUxeOoBsZAtf3SBApwpmIGi1WlJissTdFcRhwZDZD';
if (!FB_PAGE_TOKEN) {
    throw new Error('missing FB_PAGE_TOKEN');
}
var FB_APP_SECRET = process.env.FB_APP_SECRET || '167508c589a6eca1435fbb066ae1f082';
if (!FB_APP_SECRET) {
    throw new Error('missing FB_APP_SECRET');
}

var FB_VERIFY_TOKEN = 'jogogoalex';
// crypto.randomBytes(8, (err, buff) => {
//     if (err) throw err;
//     FB_VERIFY_TOKEN = buff.toString('hex');
//     console.log(`/webhook will accept the Verify Token "${FB_VERIFY_TOKEN}"`);
// });

// ----------------------------------------------------------------------------
// Messenger API specific code

// See the Send API reference
// https://developers.facebook.com/docs/messenger-platform/send-api-reference

var fbMessage = function fbMessage(id, text) {
    var body = JSON.stringify({
        recipient: { id: id },
        message: { text: text }
    });
    var qs = 'access_token=' + encodeURIComponent(FB_PAGE_TOKEN);
    return (0, _nodeFetch2.default)('https://graph.facebook.com/me/messages?' + qs, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
    }).then(function (rsp) {
        return rsp.json();
    }).then(function (json) {
        if (json.error && json.error.message) {
            throw new Error(json.error.message);
        }
        return json;
    });
};

// ----------------------------------------------------------------------------
// Wit.ai bot specific code

// This will contain all user sessions.
// Each session has an entry:
// sessionId -> {fbid: facebookUserId, context: sessionState}
var sessions = {};

var findOrCreateSession = function findOrCreateSession(fbid) {
    var sessionId = void 0;
    // Let's see if we already have a session for the user fbid
    Object.keys(sessions).forEach(function (k) {
        if (sessions[k].fbid === fbid) {
            // Yep, got it!
            sessionId = k;
        }
    });
    if (!sessionId) {
        // No session found for user fbid, let's create a new one
        sessionId = new Date().toISOString();
        sessions[sessionId] = { fbid: fbid, context: {} };
    }
    return sessionId;
};

// Our bot actions
var actions = {
    send: function send(_ref, _ref2) {
        var sessionId = _ref.sessionId;
        var text = _ref2.text;

        // Our bot has something to say!
        // Let's retrieve the Facebook user whose session belongs to
        var recipientId = sessions[sessionId].fbid;
        if (recipientId) {
            // Yay, we found our recipient!
            // Let's forward our bot response to her.
            // We return a promise to let our bot know when we're done sending
            return fbMessage(recipientId, text).then(function () {
                return null;
            }).catch(function (err) {
                console.error('Oops! An error occurred while forwarding the response to', recipientId, ':', err.stack || err);
            });
        } else {
            console.error('Oops! Couldn\'t find user for session:', sessionId);
            // Giving the wheel back to our bot
            return Promise.resolve();
        }
    }
    // You should implement your custom actions here
    // See https://wit.ai/docs/quickstart

};

// Setting up our bot
var wit = new _nodeWit.Wit({
    accessToken: WIT_TOKEN,
    actions: actions,
    logger: new _nodeWit.log.Logger(_nodeWit.log.INFO)
});

// Starting our webserver and putting it all together
var app = (0, _express2.default)();
app.use(function (_ref3, rsp, next) {
    var method = _ref3.method,
        url = _ref3.url;

    rsp.on('finish', function () {
        console.log(rsp.statusCode + ' ' + method + ' ' + url);
    });
    next();
});
app.use(_bodyParser2.default.json({ verify: verifyRequestSignature }));

// Webhook setup
app.get('/webhook', function (req, res) {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === FB_VERIFY_TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.sendStatus(400);
    }
});

// Message handler
app.post('/webhook', function (req, res) {
    // Parse the Messenger payload
    // See the Webhook reference
    // https://developers.facebook.com/docs/messenger-platform/webhook-reference
    var data = req.body;

    if (data.object === 'page') {
        data.entry.forEach(function (entry) {
            entry.messaging.forEach(function (event) {
                if (event.message && !event.message.is_echo) {
                    (function () {
                        // Yay! We got a new message!
                        // We retrieve the Facebook user ID of the sender
                        var sender = event.sender.id;

                        // We retrieve the user's current session, or create one if it doesn't exist
                        // This is needed for our bot to figure out the conversation history
                        var sessionId = findOrCreateSession(sender);

                        // We retrieve the message content
                        var _event$message = event.message,
                            text = _event$message.text,
                            attachments = _event$message.attachments;


                        if (attachments) {
                            // We received an attachment
                            // Let's reply with an automatic message
                            fbMessage(sender, 'Sorry I can only process text messages for now.').catch(console.error);
                        } else if (text) {
                            // We received a text message

                            // Let's forward the message to the Wit.ai Bot Engine
                            // This will run all actions until our bot has nothing left to do
                            wit.runActions(sessionId, // the user's current session
                            text, // the user's message
                            sessions[sessionId].context // the user's current session state
                            ).then(function (context) {
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
                            }).catch(function (err) {
                                console.error('Oops! Got an error from Wit: ', err.stack || err);
                            });
                        }
                    })();
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
        var method = elements[0];
        var signatureHash = elements[1];

        var expectedHash = _crypto2.default.createHmac('sha1', FB_APP_SECRET).update(buf).digest('hex');

        if (signatureHash !== expectedHash) {
            throw new Error('Couldn\'t validate the request signature.');
        }
    }
}

app.listen(PORT);
console.log('Listening on :' + PORT + '...');