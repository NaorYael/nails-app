import {config} from 'dotenv';
config();
import * as express from 'express';
import { api } from './api';
import {UserController} from "../shared/UserController";

const app = express();
app.use(api);

const accountSid = process.env['accountSid'];
const authToken = process.env['authToken'];

// console.log({accountSid,authToken})

app.listen(3002, () => console.log("Server started"));
const twilio = require('twilio');

const client = new twilio(accountSid, authToken);

UserController.sendSMS = async (code: number, phone: string) =>{
  try {
     await client.messages
      .create({
        body: code,
        to: phone, // Text this number
        from: '+16187643550', // From a valid Twilio number
      });
  }catch (err:any){
    console.log(err);
  }
}
// UserController.sendSMS(5270 ,'+972507330590')

