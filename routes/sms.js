const express = require("express");
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: "4c84a443",
  apiSecret: "XlLwGSyFFnD36C2K",
}, {debug: true});

const router = express.Router();

// Display the dashboard page
router.get("/", (req, res) => {
  res.render("sms");
});

router.post('/', (req, res) => {
  res.send(req.body);
  const toNumber = req.body.number;
  const text = req.body.text;
  nexmo.message.sendSms(
    918178411246, toNumber, text, {type: 'unicode'},
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.dir(responseData);
        // Optional: add socket.io -- will explain later
      }
    }
  );

 // Sending SMS via Nexmo ---
});


module.exports = router;