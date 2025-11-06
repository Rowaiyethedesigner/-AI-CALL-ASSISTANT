const express = require("express");
const dotenv = require("dotenv");
const twilio = require("twilio");

dotenv.config();
const app = express();
app.use(express.json());

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// ✅ Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running successfully 🚀",
    environment: {
      TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ? "✅ Loaded" : "❌ Missing",
      TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN ? "✅ Loaded" : "❌ Missing",
      TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER ? "✅ Loaded" : "❌ Missing",
      PORT: process.env.PORT ? `✅ ${process.env.PORT}` : "❌ Missing"
    },
    timestamp: new Date().toISOString()
  });
});

// ✅ Test Call Route
app.post("/makecall", async (req, res) => {
  try {
    const call = await client.calls.create({
      to: process.env.TEST_PHONE_NUMBER, // Replace with verified number
      from: process.env.TWILIO_PHONE_NUMBER,
      url: "http://demo.twilio.com/docs/voice.xml"
    });

    res.json({ success: true, callSid: call.sid });
  } catch (error) {
    console.error("❌ Error making the call:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
