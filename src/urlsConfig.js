const baseAPIURL = process.env.REACT_APP_API_BASE_URL
const baseURL = process.env.REACT_APP_BASE_URL
const validateEndpointURL = (account) => {
    return `validate/${account}`;
}

const initateValidationURL = "initiate";

const pendingRequestURL = "pending";

const approveURL = "approve";

//350002
const getShortCodeAccountDetailsURL = (shortcode) => {
    return `get-account-details/${shortcode}`
}

const shortCodeAccountURL = (shortcode) => {
    return `get-account/${shortcode}`
}

const getReceiptURL = (shortcode) => {
    return `shortcodes/print/${shortcode}`;
}

const URLConstants = {
    baseAPIURL,
    baseURL,
    validateEndpointURL,
    initateValidationURL,
    pendingRequestURL,
    approveURL,
    getShortCodeAccountDetailsURL,
    shortCodeAccountURL,
    getReceiptURL
}
export default URLConstants




