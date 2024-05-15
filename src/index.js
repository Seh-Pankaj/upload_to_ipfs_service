const express = require("express");
require("dotenv").configDotenv();

// File Imports
const uploadToIpfs = require("./uploadToIpfs");

// Express app
const app = express();
app.use(express.json());

const PORT = process.env.PORT;

app.post("/api/upload_to_ipfs", uploadToIpfs);

app.listen(PORT, () => {
  console.log(`Have a nice day at http://localhost:${PORT}`);
});
