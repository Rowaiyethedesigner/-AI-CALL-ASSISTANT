// ====== DEPENDENCIES ======
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

// ====== APP SETUP ======
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// ====== ENV VARIABLES ======
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// ====== MAKE CALL ENDPOINT ======
app.get("/makecall", async (req, res) => {
  const to = req.query.to;

  if (!to) {
    return res.status(400).send("Please provide a 'to' number in the URL, e.g. /makecall?to=+2348012345678");
  }

  try {
    const call = await client.calls.create({
      to: to,
      from: fromNumber,
      // ⚠️ Replace this ngrok link after running "ngrok http 3000"
      url: "https://postdiagnostic-labradoritic-gudrun.ngrok-free.dev/voice",
    });

    console.log("✅ Call initiated:", call.sid);
    res.send({ success: true, sid: call.sid });
  } catch (error) {
    console.error("❌ Error making the call:", error.message);
    res.status(500).send({ success: false, error: error.message });
  }
});

// ====== TWILIO VOICE RESPONSE ======
app.post("/voice", (req, res) => {
  res.set("Content-Type", "text/xml");
  res.send(`
    <Response>
      <Say voice="alice">
        Hi, this is Tosin from The Diamond Project — your virtual call assistant.
        You recently received a message from The Diamond Project Initiative,
        as one of those recommended to be a part of the project here in Abuja.

        The Diamond Project is a non-governmental initiative focused on financial
        and personal development. Our mission includes empowering individuals
        looking for additional sources of income, as well as high-net-worth
        individuals seeking ways to support and uplift people around them.

        The reason we’re reaching out to you is because you were among those
        handpicked to be part of an exclusive event happening at Novare Shopping Mall
        this coming Sunday. If we go ahead and make a reservation for you,
        would you be available?

        Please go ahead and confirm that we sent a message to your number
        at the end of this call. Thank you!
      </Say>
    </Response>
  `);
});

// ====== SERVER LISTEN ======
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
