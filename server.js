/* /server.js */

//main file

// Load environment variables
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
// Connecting the database connection
const sequelize = require("./util/database");

const app = express();

// Body parser middleware
app.use(express.json()); // For parsing application/json

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// First route
app.get("/", (req, res) => {
  res.send("Welcome to Spendzi server!");
});

// Start the server
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log(`Server is listening on port 3000.`);
  });
}).catch(error => {
  console.error('Unable to connect to the database:', error);
});
