import {config} from 'dotenv';
import * as express from 'express';
import {api} from './api';
import {UserController} from "../shared/UserController";
import helmet from 'helmet';
import * as  compression from 'compression';
import sslRedirect from 'heroku-ssl-redirect';
import * as path from 'path';
import {expressjwt} from 'express-jwt'
import {sendSms} from "./sms";
import {EventsController} from "../shared/EventsController";
import {addEvent, getEvents} from "./google_calendar";

config(); //loads the configuration from the .env file

const app = express();
app.use(expressjwt({
  secret: process.env['JWT_SECRET'] || "my secret",
  credentialsRequired: false,
  algorithms: ['HS256']
}));
app.use(sslRedirect());
app.use(helmet({contentSecurityPolicy: false}));
app.use(compression());
app.use(api);
app.use(express.static(path.join(__dirname, '../nails-app')));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../nails-app', 'index.html'));
});
app.listen(process.env["PORT"] || 3002, () => console.log("Server started"));

UserController.sendSMS = async (code: string, phone: string) => {
  await sendSms(phone, code);
}
EventsController.addEvent = async (e: any) => {
  return addEvent(e);
}
EventsController.getEvents = async () => {
  return getEvents();
}

// //TODO delete
// EventsController.watchEvents = async () => {
//   app.post('/webhook', async (request, reply) => {
//     const resourceId = request.headers['x-goog-resource-id'];
//     const channelToken = request.headers['x-goog-channel-token'];
//     const channelId = request.headers['x-goog-channel-id'];
//     const resourceState = request.headers['x-goog-resource-state'];
//
//     // // Use the channel token to validate the webhook
//     // if (channelToken !== webhookToken) {
//     //   return reply.status(403).send('Invalid webhook token');
//     // }
//
//     if (resourceState === 'sync') {
//       return reply.status(200).send();
//     }
//
//     return reply.status(200).send('Webhook received');
//   });
//   return watch();
// }

