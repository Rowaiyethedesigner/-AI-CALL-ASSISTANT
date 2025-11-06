// CommonJS version for checkenv route
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.get("/checkenv", (req, res) => {
  try {
    const envStatus = {
      TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ? "✅ Loaded" : "❌ Missing",
      TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN ? "✅ Loaded" : "❌ Missing",
      TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER ? "✅ Loaded" : "❌ Missing",
      PORT: process.env.PORT || "Not set"
    };
    res.json(envStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
