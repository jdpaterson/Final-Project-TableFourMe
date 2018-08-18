require('dotenv').config()

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const host = 'www.tablefour.me';

module.exports = {
  resoTextMsg: function (phone, reservation) {
    return new Promise((resolve, reject) => {
      const url = `${host}/reservations/${reservation.res_code}`;
      const textBody = `Thank you for your reservation! \nYour reference code: ${reservation.res_code}. \nPlease visit ${url} to view your place in line.`
      return client.messages.create({
        to: phone,
        from: process.env.FROM_NUMBER,
        body: textBody
      })
        .then(message => {
          console.log("sending sms to " + phone, message.body);
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },


  // orderPlacedMsg: function () {
  //const url = `${host}/home/reservations/${res_code}`;
  //   return client.messages.create({
  //      to: phone,
  //      from: process.env.FROM_NUMBER,
  //      body: 'Your order has been placed.Thank you! Please visit http://${url} to view your place in line. We will notify you when your table is ready!'
  //    })
  //      .then((message) => console.log("sending sms to " + phone, message.sid))
  //      .catch(err => { console.log(err) });
  //  },
  //}

  tableReadyMsg: function () {
    return client.messages.create({
      to: phone,
      from: process.env.FROM_NUMBER,
      body: "Thank you for waiting! Your table is ready!"
    })
      .then((message) => console.log("sending sms to " + phone, message.sid))
      .catch(err => { console.log(err) });
  },
}