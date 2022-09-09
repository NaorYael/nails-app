const {google} = require('googleapis');
require('dotenv').config();

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const CALENDAR_ID = process.env.CALENDAR_ID;

const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version: "v3"});

const auth = new google.auth.JWT(
  CREDENTIALS.client_email,
  null,
  CREDENTIALS.private_key,
  SCOPES
);

const TIMEOFFSET = '+05:30'

const dateTimeForCalendar = () => {
  let date = new Date();

  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  let day = date.getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let newDateTime = `${year}-${month}-${day}T${hour}:${minutes}:00.000${TIMEOFFSET}`;

  let startDate = new Date(Date.parse(newDateTime));
  let endDate = new Date(new Date(startDate).setHours(startDate.getHours() + 1));

  return {'start': startDate, 'end': endDate}
};

 console.log(dateTimeForCalendar())

//
//  const insertEvent = async (event)=> {
//   try {
//     let response = await calendar.events.insert({
//       auth: auth,
//       calendarId: CALENDAR_ID,
//       resource: event
//     });
//     if (response[`status`] === 200) {
//       return 1
//     } else {
//       console.log(response)
//       return 0;
//     }
//   } catch (e) {
//     console.log(`Error at insertEvent --> ${e}`);
//     return 0;
//   }
// };
//
// let dateTime = dateTimeForCalendar();
//
// let event = {
//   'summary': 'This is a summary.',
//   'description': 'This is a description',
//   'start': {
//     'dateTime': dateTime['start'],
//     'timeZone': 'Asia/Jerusalem'
//   },
//   'end': {
//     'dateTime': dateTime['end'],
//     'timeZone': 'Asia/Jerusalem'
//   }
// };
//
// insertEvent(event)
//   .then((res) => {
//   console.log(res);
// }).catch((err) => {
//   console.log(err);
// })
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


  const deleteEvent = async (eventId) => {
    try {
      let response = await calendar.events.delete({
        auth: auth,
        calendarId: CALENDAR_ID,
        eventId: eventId
      });
      if (response.data === ''){
        return 1;
      } else {
        return 0;
      }

    } catch (e) {
      console.log(`Error at deleteEvent -->  ${e}`)
    }
  }

  let eventId = 'atqojad64lvmrbdiqkt45ll6s8';

  deleteEvent(eventId).then((res) => {
    console.log(res);
  }).catch((err) => {
    console.log(err);
  });
