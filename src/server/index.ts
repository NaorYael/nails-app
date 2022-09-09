import {config} from 'dotenv';
config();
import * as express from 'express';
import { api } from './api';
import {UserController} from "../shared/UserController";
import helmet from 'helmet';
import * as  compression from 'compression';
import sslRedirect from 'heroku-ssl-redirect';
import * as path from 'path';
import {expressjwt} from 'express-jwt'

const app = express();
app.use(expressjwt({
  secret: process.env['JWT_SECRET'] || "my secret",
  credentialsRequired: false,
  algorithms: ['HS256']
}));
app.use(sslRedirect());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(api);

app.use(express.static(path.join(__dirname, '../nails-app')));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../nails-app', 'index.html'));
});
app.listen(process.env["PORT"] || 3002, () => console.log("Server started"));

// const accountSid = process.env['accountSid'];
// const authToken = process.env['authToken'];
// const twilio = require('twilio');
//
// const client = new twilio(accountSid, authToken);
//
// UserController.sendSMS = async (code: string, phone: string) => {
//   try {
//     return await client.messages
//       .create({
//         body: code,
//         to: phone, // Text this number
//         from: '+16187643550', // From a valid Twilio number
//       });
//   } catch (err: any) {
//     console.log({err});
//     return err;
//   }
// }//UserController.sendSMS('5270' ,'+972507330590')

const { google } = require("googleapis");

const GOOGLE_PRIVATE_KEY = process.env['private_key'];
const GOOGLE_CLIENT_EMAIL = process.env['client_email'];
const GOOGLE_PROJECT_NUMBER = process.env['project_number'];
const GOOGLE_CALENDAR_ID = process.env['calendar_id'];

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

const jwtClient = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY,
  SCOPES
);

const calendar = google.calendar({
  version: "v3",
  project: GOOGLE_PROJECT_NUMBER,
  auth: jwtClient,
});

const auth = new google.auth.GoogleAuth({
  keyFile: "./keys.json",
  scopes: SCOPES,
});

const calendarEvent = {
  summary: "Test Event added by Node.js",
  description: "This event was created by Node.js",
  start: {
    dateTime: "2022-06-03T09:00:00-02:00",
    timeZone: "Asia/Jerusalem",
  },
  end: {
    dateTime: "2022-06-04T17:00:00-02:00",
    timeZone: "Asia/Jerusalem",
  },
  attendees: [],
  reminders: {
    useDefault: false,
    overrides: [
      { method: "email", minutes: 24 * 60 },
      { method: "popup", minutes: 10 },
    ],
  },
};

const addCalendarEvent = async () => {
  auth.getClient().then((auth: any) => {
    calendar.events.insert(
      {
        auth: auth,
        calendarId: GOOGLE_CALENDAR_ID,
        resource: calendarEvent,
      },
      function (error: any, response: any) {
        if (error) {
          console.log("Something went wrong: " + error); // If there is an error, log it to the console
          return;
        }
        console.log("Event created successfully.")
        console.log("Event details: ", response.data); // Log the event details
      }
    );
  });
};

addCalendarEvent()
  .then(r => {
  console.log(r);
}).catch(err => {
  console.log(err);});
