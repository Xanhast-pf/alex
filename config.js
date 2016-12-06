// Webserver parameter
export const PORT = process.env.PORT || 8445;

// Wit.ai parameters
export const WIT_TOKEN = process.env.WIT_TOKEN;

// Messenger API parameters
export const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;
if (!FB_PAGE_TOKEN) {
    throw new Error('missing FB_PAGE_TOKEN');
}
export const FB_APP_SECRET = process.env.FB_APP_SECRET;
if (!FB_APP_SECRET) {
    throw new Error('missing FB_APP_SECRET');
}

export const FB_VERIFY_TOKEN = 'jogogoalex';
