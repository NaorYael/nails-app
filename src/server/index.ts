import {config} from 'dotenv';
config();
import * as express from 'express';
import { api } from './api';
import {UserController} from "../shared/UserController";

const app = express();
app.use(api);

const accountSid = process.env['accountSid'];
const authToken = process.env['authToken'];


app.listen(3002, () => console.log("Server started"));
const twilio = require('twilio');

const client = new twilio(accountSid, authToken);

UserController.sendSMS = (code: number, phone: string) =>{
  console.log(code, phone)
  client.messages
    .create({
      body: code,
      to: phone, // Text this number
      from: '+16187643550', // From a valid Twilio number
    })
    .then((message: any) => console.log(message.sid));
}

