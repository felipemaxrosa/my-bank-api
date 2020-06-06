const express = require('express');
const winston = require('winston');
const fs = require('fs').promises;
const app = express();
const accountsRouter = require("./routes/accounts");

global.fileName = "accounts.json";

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({level, message, label, timestamp}) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
  level: "silly",
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({filename: "my-bank.api.log"})
  ],
  format: combine(
    label({ label: "my-bank-api"}),
    timestamp(),
    myFormat
  )
});

app.use(express.json());
app.use("/account", accountsRouter);

const port = 3000;

app.listen(port, async () => {
  try {
    await fs.readFile(global.fileName, "utf8");
    logger.info('API started!');
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: []
    };

    await fs.writeFile("accounts.json", JSON.stringify(initialJson));
    logger.error(err.message);
  }
});