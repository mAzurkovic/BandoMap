module.exports = {
  'facebookAuth' : {
        'clientID'      : '137450936923238', // your App ID
        'clientSecret'  : '95d4af852e2d15d899c80f1a4ef72f1e', // your App Secret
        'callbackURL'   : 'https://bandomap.com/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
    }
}
