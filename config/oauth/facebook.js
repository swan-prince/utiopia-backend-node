const queryString = require('query-string');

const facebookConfigParams = () => {
    return queryString.stringify({
    client_id: process.env.FACEBOOK_APP_ID,
    redirect_uri: process.env.RETURN_URL,
    scope: ['email', 'user_friends'].join(','),
    response_type: 'code',
    auth_type: 'rerequest',
    display: 'popup'
    });
}

module.exports.facebookConfigParams = facebookConfigParams;