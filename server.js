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
      url: "https://ai-call-assistant-znyw.onrender.com/voice", // 🔁 replace this with your Render domain
    });

    console.log(`✅ Call initiated successfully. SID: ${call.sid}`);
    res.json({ success: true, message: "Call initiated successfully", sid: call.sid });
  } catch (error) {
    console.error("❌ Error making the call:", error.message);
    res.json({ success: false, error: error.message });
  }
});

// ====== TWIML RESPONSE (Voice) ======
app.post("/voice", (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();
  twiml.say(
    {
      voice: "alice",
      language: "en-GB",
    },
    "Hi, this is Tosin from the Diamond Project, your virtual call assistant. You received this call because you were recommended to be part of our project in Abuja. The Diamond Project is a non-governmental initiative focused on financial and personal development, helping individuals find new sources of income and empowering others. We’re hosting an event this Sunday at Novare Shopping Mall. If we reserve a spot for you, would you be available? Please confirm that we sent you this message at the end of this call. Thank you."
  );

  res.type("text/xml");
  res.send(twiml.toString());
});

// ====== START SERVER ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
