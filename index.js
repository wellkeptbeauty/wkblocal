// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://heroku_nrvn8l4v:5fnbgck1bg3evcsos53jhsgdfn@ds139869.mlab.com:39869/heroku_nrvn8l4v',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'rtAwZgAp1n3wLWENA7QIBCx9KqwiuEL1REI2o6Xa',
  masterKey: process.env.MASTER_KEY || 'pKDFFTbtPrrzava6k3nXngkkupsHkeKjjGxp4TZk', //Add your master key here. Keep it secret!
  fileKey:process.env.FILE_KEY || 'efb90c48-072f-439e-b841-b8dc455de16b', //Add your filekey here.
  serverURL: process.env.SERVER_URL || 'https://wkblocal.herokuapp.com/parse',  // Don't forget to change to https if needed
  push: {
   ios: [
//    {
//       pfx:__dirname + '/certificates/pushfordevelopmentwell.p12',
//       bundleId: 'com.wellkeptbeauty',
//       production: false
//     }
//      //,
       {
      pfx: __dirname + '/certificates/pushfordistributionwell.p12', // Prod PFX or P12
      bundleId: 'com.wellkeptbeauty',  
      production: true // Prod
    }
  ]
}, 
  
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  },
  
  verifyUserEmails: true,
  publicServerURL: 'https://wkblocal.herokuapp.com/parse',
 // appName: 'Parse App',
  appName: 'Well-Kept Beauty App',
  emailAdapter: {
 module: 'parse-server-simple-mailgun-adapter',
 options: {
 fromAddress: process.env.EMAIL_FROM || "noreply@wellkeptbeauty.com",
//  domain: process.env.MAILGUN_DOMAIN || "stampvity.betabulls.net",
//  apiKey: process.env.MAILGUN_API_KEY || "key-b6fe80ed8ae21e1901fea443850c22d0",  
 domain: process.env.MAILGUN_DOMAIN || "sandbox284d4402a6c74d92b8394c59de4f5f91.mailgun.org",
 apiKey: process.env.MAILGUN_API_KEY || "key-fc1b81ab9684eb7f3982129f64067e7b",
 // Verification email subject
 verificationSubject: 'Please verify your e-mail for wellkeptbeauty',
 // Verification email body
 verificationBody: 'Hi,\n\nYou are being asked to confirm the e-mail address %email% with %appname%\n\nClick here to confirm it:\n%link%',

// Password reset email subject
 passwordResetSubject: 'Password Reset Request for wellkeptbeauty',
 // Password reset email body
 passwordResetBody: 'Hi,\n\nYou requested a password reset for %appname%.\n\nClick here to reset it:\n%link%',
 //OPTIONAL (will send HTML version of email):
 passwordResetBodyHTML: "<!--DOCTYPE html>........"
 }
 }
  
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
