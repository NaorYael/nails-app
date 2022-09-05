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

// const secret = process.env['JWT_SECRET'];

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
 const accountSid = process.env['accountSid'];
 const authToken = process.env['authToken'];

// console.log({accountSid,authToken})

app.listen(3002, () => console.log("Server started"));
const twilio = require('twilio');

const client = new twilio(accountSid, authToken);

UserController.sendSMS = async (code: string, phone: string) => {
  try {
    return await client.messages
      .create({
        body: code,
        to: phone, // Text this number
        from: '+16187643550', // From a valid Twilio number
      });
  } catch (err: any) {
    console.log({err});
    return err;
  }
}
// UserController.sendSMS(5270 ,'+972507330590')

