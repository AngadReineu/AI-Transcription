const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

async function transcribeWithWhisper(filePath) {
  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    const response = await axios.post(
      "http://localhost:9001/inference",
      form,
      { headers: form.getHeaders(), maxBodyLength: Infinity}
    );

    return response.data; 
  } catch (err) {
    console.error(" Whisper HTTP error:", err.message, err.response?.data);
    throw err;
  }
}

module.exports = { transcribeWithWhisper };
