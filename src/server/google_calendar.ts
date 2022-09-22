const {google} = require('googleapis');
require('dotenv').config();

// const {v4: uuidv4} = require('uuid');

const CREDENTIALS = JSON.parse(process.env['CREDENTIALS']!);
const CALENDAR_ID = process.env['CALENDAR_ID']!;
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const auth = new google.auth.JWT(
  CREDENTIALS.client_email,
  null,
  CREDENTIALS.private_key,
  SCOPES
);
const calendar = google.calendar({version: 'v3'});
const serverPort = 8080;

// const watchResponse = async () => {
//   const tunnel = await localtunnel({
//     port: serverPort
//   });
//
//   await calendar.events.watch({
//     auth: auth,
//     calendarId: CALENDAR_ID,
//     resource: {
//       id: uuidv4(),
//       type: 'web_hook',
//       // TODO tunnel.url
//       address: `${tunnel.url}/webhook`, // Expose localhost using a secure tunnel
//       token: localtunnel.token,
//     },
//   });
// }
//
// export async function watch() {
//   // Authorization details for google API are explained in previous steps.
//   const calendar = google.calendar({version: 'v3'});
//   // Get the events that changed during the webhook timestamp by using timeMin property.
//   const event = await calendar.events.list({
//     auth: auth,
//     calendarId: CALENDAR_ID,
//     timeMin: new Date().toISOString(),
//     maxResults: 10,
//     singleEvents: true,
//     orderBy: 'startTime',
//   });
//   // log in the console the total events that changed since the webhook was called.
//   console.log(event.data.items);
//
//
//   watchResponse()
//     .then(r => {
//       console.log(r);
//       return r;
//     }).catch(e => {
//     console.log(e);
//     return e;
//   });
// }


//
// const TIMEOFFSET = '+03:00'
//
// const dateTimeForCalendar = (e: any) => {
//   let date = e.date;
//
//   let year = date.getFullYear();
//   let month = (date.getMonth() + 1).toString();
//   if (month.length === 1) {
//     month = `0${month}`;
//   }
//   let day = date.getDate().toString();
//   if (day.length === 1) {
//     day = `0${day}`;
//   }
//   let hour = date.getHours().toString().padStart(2, '0');
//
//   let minutes = date.getMinutes().toString().padStart(2, '0');
//
//
//   let newDateTime = `${year}-${month}-${day}T${hour}:${minutes}:00.000${TIMEOFFSET}`;
//
//   let startDate = new Date(Date.parse(newDateTime));
//   let endDate = new Date(new Date(startDate).setHours(startDate.getHours() + 1));
//
//   return {'start': startDate, 'end': endDate}
// };

const insertEvent = async (event: any) => {
  try {
    let response = await calendar.events.insert({
      auth: auth,
      calendarId: CALENDAR_ID,
      resource: event
    });
    if (response[`status`] === 200) {
      return response.data.id
    } else {
      return '';
    }
  } catch (e) {
    console.log(`Error at insertEvent --> ${e}`);
    return '';
  }
};

export function addEvent(e: any) {

  let event = {
    'summary': e.title + ' - ' + e.subtitle,
    'description': e.phone + ' | ' + e.username + ' - ' + +e.price + '₪',
    'start': {
      'dateTime': e.startDate,
      'timeZone': 'Asia/Jerusalem'
    },
    'end': {
      'dateTime': e.endDate,
      'timeZone': 'Asia/Jerusalem'
    }
  };

  return insertEvent(event)
    .then((res) => {
      console.log(res);
      return res;
    }).catch((err) => {
      console.log(err);
      return err;
    })
}


export function getEvents() {

  let startDate = new Date();
  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 1);

  const getEvents = async (startDate: Date, endDate: Date) => {
    try {
      let response = await calendar.events.list({
        auth: auth,
        calendarId: CALENDAR_ID,
        timeMin: startDate,
        timeMax: endDate,
        timeZone: 'Asia/Jerusalem'
      });
      return response['data']['items'];

    } catch (e) {
      console.log(`Error at getEvents --> ${e}`);
      return e;
    }
  }

  return getEvents(startDate, endDate)
    .then((res) => {
      console.log(res);
      return res;
    }).catch((err) => {
      console.log(err);
      return err
    });
}


// const deleteEvent = async (eventId: string) => {
//   try {
//     let response = await calendar.events.delete({
//       auth: auth,
//       calendarId: CALENDAR_ID,
//       eventId: eventId
//     });
//     if (response.data === ''){
//       return 1;
//     } else {
//       return 0;
//     }
//
//   } catch (e) {
//     console.log(`Error at deleteEvent -->  ${e}`)
//     return e;
//   }
// }
//
// let eventId = 'atqojad64lvmrbdiqkt45ll6s8';
//
// deleteEvent(eventId).then((res) => {
//   console.log(res);
// }).catch((err) => {
//   console.log(err);
// });
