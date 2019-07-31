const express = require("express");
const ip = require("ip");
const bodyParser = require("body-parser");

const app = express();
const port = 4000;

let guests = [];

app.use(bodyParser.json());

app.post((req, res, next) => {
  const {
    body: { coolSecret }
  } = req;
  if (coolSecret !== "Snaggy2Dope!") {
    res.status(401).send("lol no");
  }
  next();
});

app.post("/", (req, res) => {
  const {
    body: { checkins }
  } = req;

  const guestsToAdd = checkins.map(checkin => ({
    rfid: checkin.rfid,
    message: checkin.message,
    checkedIn: false
  }));

  guests = guests.concat(guestsToAdd);
  res.send({ addedGuests: guestsToAdd });
});

app.post("/checkin", (req, res) => {
  const {
    body: { rfid }
  } = req;
  const possibleGuest = guests.find(guest => guest.rfid == rfid);
  if (possibleGuest) {
    guests[guests.indexOf(possibleGuest)] = {
      rfid: possibleGuest.rfid,
      message: possibleGuest.message,
      checkedIn: true
    };
    res.send(possibleGuest);
  } else {
    res.status(404).send("No guest with that rfid");
  }
});

app.get("/admin", (req, res) => {
  const html = `<table style="width: 100%">
      <tr>
        <th>RFID</th>
        <th>Message</th>
        <th>Checked In</th>
      </tr>
      ${guests.map(
        guest => `<tr>
          <td>${guest.rfid}</td>
          <td>${guest.message}</td>
          <td style="background: ${guest.checkedIn ? "green" : "red"}">
            ${guest.checkedIn ? `yep` : `nope`}
          </td>
        </tr>`
      )}
    </table>`;
  res.send(html);
});

app.listen(port, () =>
  console.log(`Checkin Boop Server listening at ${ip.address()}:${port}`)
);
