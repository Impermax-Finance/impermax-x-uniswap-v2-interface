"use strict";

const path = require('path');
const express = require("express");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;
const env = process.env.ENVIRONMENT || 'dev';


app.use(express.static(path.join(__dirname, 'dist')));


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});