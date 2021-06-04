const {google} = require('googleapis');

/*I have the return url as the login page endpoint and setting the google login url to sessionStorage
on the front end*/
const googleConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirect: process.env.RETURN_URL // this must match your google api settings
};

//what do we want to request from google
const defaultScope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email'
];

//creates a connection
const googleCreateConnection = () => {
    return new google.auth.OAuth2(
      googleConfig.clientId,
      googleConfig.clientSecret,
      googleConfig.redirect
    );
}

/*this is called after the connection is created to grab the google sign in url and return it to the user
on the front end*/
const googleGetConnectionUrl = (auth) => {
    return auth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
      scope: defaultScope
    });
}

//returns the google plus api
const googleGetPlusApi = (auth) => {
    return google.plus({ version: 'v1', auth });
}

const googleGetAccount = async (codeParamToken,accountCallback) => {
    //codeParamToken is the auth token from the code query string parameter in the get request
    
    //add the tokens to the google api so we have access to the account
    const auth = createConnection();
    auth.setCredentials(codeParamToken);
    
    //connect to google plus - need this to get the user's email
    const plus = googleGetPlusApi(auth);
    //the hardcoded string 'me' is actually used to indicate the authenticated user
    const me = await plus.people.get({ userId: 'me' });
    
    //get the google id and email
    const userGoogleId = me.data.id;
    const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
    const userGoogleFirstName = me.data.name.givenName;
    const userGoogleLastName = me.data.name.familyName;
  
    //returns the credentials so we can login or sign up the user
    //the tokens field is for getting the user's credentials without them having to log in again
    accountCallback({
      id: userGoogleId,
      email: userGoogleEmail,
      firstName: userGoogleFirstName,
      lastName: userGoogleLastName,
      token: codeParamToken
    });
  }

module.exports.googleCreateConnection = googleCreateConnection;
module.exports.googleGetConnectionUrl = googleGetConnectionUrl;
module.exports.googleGetAccount = googleGetAccount;