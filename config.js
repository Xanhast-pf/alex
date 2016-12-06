// @flow
// Webserver parameter
const PORT = process.env.PORT || 8445;

// Wit.ai parameters
const WIT_TOKEN = process.env.WIT_TOKEN;

// Messenger API parameters
const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;
if (!FB_PAGE_TOKEN) {
    throw new Error('missing FB_PAGE_TOKEN');
}
const FB_APP_SECRET = process.env.FB_APP_SECRET;
if (!FB_APP_SECRET) {
    throw new Error('missing FB_APP_SECRET');
}

const FB_VERIFY_TOKEN = 'jogogoalex';

export {
    PORT,
    WIT_TOKEN,
    FB_VERIFY_TOKEN,
    FB_APP_SECRET,
    FB_PAGE_TOKEN
};
