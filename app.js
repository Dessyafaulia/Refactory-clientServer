const express = require("express");
const axios = require("axios");
const bp = require("body-parser");

var myLoggers = require("log4js");
myLoggers.configure({
  appenders: { mylogger: { type: "file", filename: "./server.log" } },
  categories: { default: { appenders: ["mylogger"], level: "ALL" } },
});
const logger = myLoggers.getLogger("default");

const config = {
   port: 3000
}

const app = express();


app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));


app.post("/request", (req, res) => {
  let data = req.body.counter
  logger.debug(`[${Date.now()}] Success: ${req.headers.host} { counter: ${data}, x-random: ${req.headers.xrandom}}`)
  res.status(201)
});

function makeid(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

var count = 0;

setInterval(function () {
  axios.post(
    "http://localhost:3000/request",
    {
      counter: count,
    },
    {
      headers: {
        "XRANDOM": makeid(6),
      },
    }
  );
  count++
}, 60000);

app.listen(config.port);
console.log(`App listening on http://localhost:${config.port}`);
