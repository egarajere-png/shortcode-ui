const validateEndpointURL = (account) => {
    return `/validate/${account}`;
}

const initateValidationURL = "/initiate";

const pendingRequestURL = "/pending";

const validateURL = "/approve";

//350002
const shortCodeAccountDetailsURL = (shortcode) => {
    return `/get-account-details/${shortcode}`
}

const shortCodeAccountURL = (shortcode) => {
    return `/get-account/${shortcode}`
}
const URLConstants = [
    validateEndpointURL,
    initateValidationURL,
    pendingRequestURL,
    validateURL,
    shortCodeAccountDetailsURL,
    shortCodeAccountURL
]
export default URLConstants




