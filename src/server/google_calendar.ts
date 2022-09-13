const {google} = require('googleapis');
require('dotenv').config();

const CREDENTIALS = JSON.parse(process.env['CREDENTIALS']!);
const CALENDAR_ID = process.env['CALENDAR_ID']!;

const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version: "v3"});

const auth = new google.auth.JWT(
  CREDENTIALS.client_email,
  null,
  CREDENTIALS.private_key,
  SCOPES
);
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
    console.log({response});
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
    'summary': e.username + ' | ' + e.title + ' - ' + e.subtitle,
    'description': e.phone + ' | ' + e.price + '₪',
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

//
// const getEvents = async (dateTimeStart, dateTimeEnd) => {
//     try {
//       let response = await calendar.events.list({
//         auth: auth,
//         calendarId: CALENDAR_ID,
//         timeMin: dateTimeStart,
//         timeMax: dateTimeEnd,
//         timeZone: 'Asia/Jerusalem'
//       });
//       console.log(response['data']['items'])
//       return response['data']['items'];
//
//     }catch (e) {
//       console.log(`Error at getEvents --> ${e}`);
//
//       return 0;
//   }
// }
// let start = '2021-09-08T09:30:00.000Z';
// let end = '2023-09-08T10:30:00.000Z';
//
//   getEvents(start, end)
//     .then((res) => {
//     console.log(res);
//   }).catch((err) => {
//     console.log(err);
//   });


// const deleteEvent = async (eventId) => {
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
