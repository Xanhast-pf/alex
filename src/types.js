//  @flow
//  ------------------------- TEXT MESSAGES ----------------------------------
export type TextMessage = {
    text: 'string',
    quick_replies?: Array<QuickReplies>
};

export type QuickReplies = QuickReply | QuickReplyLocation;

export type QuickReply = {
    content_type: 'text',
    title: string, // 20 chars max. Only if content_type = text
    payload: string, // 1000 chars max.
    image_url?: string // If content_type = text. 24x24 Images only
};

export type QuickReplyLocation = {
    content_type: 'location',
    payload: string
};

// -------------------------- TEMPLATES --------------------------------------
// GENERIC TEMPLATE
export type GenericTemplate = {
    type: 'template',
    payload: GenericTemplatePayload
};

export type GenericTemplatePayload = {
    template_type: 'generic',
    elements: Array<Element> // Limited to 10
};

// LIST TEMPLATE
export type ListTemplate = {
    type: 'template',
    payload: ListTemplatePayload
};

export type ListTemplatePayload = {
    template_type: 'list',
    top_element_style?: 'large' | 'compact', // Default to large
    elements: Array<Element>, // List view elements (maximum of 4 elements and minimum of 2 elements)
    buttons?: Array<Buttons> // List of buttons associated on the list template message (maximum of 1 button).
};

// BUTTON TEMPLATE
export type ButtonTemplate = {
    type: 'template',
    payload: ButtonTemplatePayload
};

export type ButtonTemplatePayload = {
    template_type: 'button',
    text: string, // Limited to 640 chars max
    buttons: Array<Buttons> // Limited to 3
};

// Element to be inserted in generic templates
export type Element = {
    title: string, // 80 chars max.
    item_url?: string, // URL that is opened when bubble is tapped
    default_action?: UrlButton, // Default action to be triggered when user taps on the element
    image_url: string, // Bubble image
    subtitle: string, // Bubble subtitle 80 chars max
    buttons?: Array<Buttons> // Set of buttons that appear as call-to-actions. Limited to 3
};

// ------------------------------- BUTTONS --------------------------------------
export type Buttons = UrlButton | PostbackButton | ShareButton | BuyButton | LoginButton | LogoutButton;
//  Post back Button
export type PostbackButton = {
    type: 'post_back',
    title: string, // 20 chars limit
    payload: string // 1000 chars max
};

//  URL Button
export type UrlButton = {
    type: 'web_url',
    url: string, // This URL is opened in a mobile browser when the button is tapped
    title: string, // Button title. 20 character limit.
    webview_height_ratio?: 'compact' | 'tall' | 'full', // Height of the Webview.
    messenger_extensions?: boolean, // Must be true if using Messenger Extensions.
    fallback_url?: string // URL to use on clients that don't support Messenger Extensions. If this is not defined, the url will be used as the fallback.
};

// Share Button
export type ShareButton = {
    type: 'element_share'
};

// Buy Button
// Buy button functionality is only available for US users.
// You will get the following error if you try to send to a user that is not in US.
// The error_subcode 2018112 indicates the user is not eligible for payment.
export type PriceList = {
    label: string,
    amount: string
};

export type PaymentSummary = {
    currency: 'string',
    is_test_payment?: boolean, // Whether this is a test payment. Once set to true, the charge will be a dummy charge.
    payment_type: 'FIXED_AMOUNT' | 'FLEXIBLE_AMOUNT',
    merchant_name: string,
    requested_user_info: 'shipping_address' | 'contact_name' | 'contact_phone' | 'contact_email', // Information requested from person that will render in the dialog. You can config these based on your product need.
    price_list: Array<PriceList>
};

export type BuyButton = {
    type: 'payment',
    title: 'buy' | string,
    payload: string, // Developer defined metadata about the purchase.
    payment_summary: PaymentSummary
};

// Login Button
export type LoginButton = {
    type: 'account_link',
    url: string // URL du rappel d’authentification. Doit utiliser le protocole HTTPS.
};

// Logout Button
export type LogoutButton = {
    type: 'account_unlink'
};
