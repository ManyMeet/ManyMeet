const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
require('dotenv').config();
// const { resolve } = require('path');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar.events'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
// fs.readFile('credentials.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   // Authorize a client with credentials, then call the Google Calendar API.
//   authorize(JSON.parse(content), listEvents);
// });

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, ...args) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);

    oAuth2Client.setCredentials(JSON.parse(token));
    
    callback(oAuth2Client, ...args);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
// function listEvents(auth) {
//   const calendar = google.calendar({version: 'v3', auth});
//   calendar.events.list({
//     calendarId: 'primary',
//     timeMin: (new Date()).toISOString(),
//     maxResults: 10,
//     singleEvents: true,
//     orderBy: 'startTime',
//   }, (err, res) => {
//     if (err) return console.log('The API returned an error: ' + err);
//     const events = res.data.items;
//     if (events.length) {
//       console.log('Upcoming 10 events:');
//       events.map((event, i) => {
//         const start = event.start.dateTime || event.start.date;
//         console.log(`${start} - ${event.summary}`);
//       });
//     } else {
//       console.log('No upcoming events found.');
//     }
//   });
// }



/**
 * Creates an event in the users calendar;
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

// function createEvent(auth) {
//   const calendar = google.calendar({version: 'v3', auth});
//   const dateStart = new Date('11 March 2022 19:00').toISOString()
//   const dateEnd = new Date('11 March 2022 19:30').toISOString()


//   var event = {
//     'summary': 'Slava wants to remind Lauma that she\'s a superstar',
//     'location': 'Our berlin casa',
//     'description': 'This event was created by a computer',
//     'start': {
//       'dateTime': dateStart,
//     },
//     'end': {
//       'dateTime': dateEnd,
//     },
//     'attendees': [
//       {'email': 'roznoshchik@gmail.com'},
//       // {'email': 'lauma.gailite@gmail.com'},
//     ]
//   };
  
//   var request = calendar.events.insert({
//     'calendarId': 'primary',
//     'resource': event
//   }, (err, res) => {
//     if (err) return console.log('The API returned an error: ' + err);
//     const events = res.data.items;
//     console.log(res);
//   });
  
//  request;
 
  

// }

let evId = 'lgdtapghtfrgmp0lkf8hgt54sc'

async function getEventFromCalendar(auth, eventId) {
  const calendar = google.calendar({version: 'v3', auth});
  let ev;
  return new Promise((resolve, reject) => {
    const evnt = calendar.events.get({
      "calendarId" :"primary", 
      "eventId":`${eventId}`
    }, (err, res) => {
      if (err) {
        console.log('The API returned an error: ' + err);
        reject('The API returned an error: ' + err )
        ;
      }
      ev = res.data;
      resolve(ev)  
    })
  });  
}

async function getEvent (auth, eventId) {
  let ev = await getEventFromCalendar(auth, eventId)
  return ev;
}

async function updateEvent(auth, eventId) {  
  const calendar = google.calendar({version: 'v3', auth: oAuth2Client});
  const ev = await getEventFromCalendar(auth, eventId);
  console.log(ev)

  ev.start.dateTime = new Date('11 March 2022 21:00').toISOString();
  ev.end.dateTime =  new Date('11 March 2022 21:30').toISOString();
  ev.summary = 'You are STILL a super star'
  ev.description = 'This event was updated by a computer'

  console.log(ev)
  calendar.events.update({
    'calendarId': 'primary',
    'eventId': evId,
    'resource':ev
  }, (err, res) => {
    if(err) console.log('Error updating', err);
    console.log(res)
  })
}




const client_secret = process.env.GOOGLE_CLIENT_SECRET
const client_id = process.env.GOOGLE_CLIENT_ID
const redirect_uris = "urn:ietf:wg:oauth:2.0:oob"
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
const token  = {
  "
}
oAuth2Client.setCredentials(token);

updateEvent(oAuth2Client, evId);




// fs.readFile('credentials.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   // Authorize a client with credentials, then call the Google Calendar API.
//   authorize(JSON.parse(content), getEvent, evId);
// });