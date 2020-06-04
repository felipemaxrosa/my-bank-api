const express = require('express');
const fs = require('fs');
const app = express();
const accountsRouter = require("./routes/accounts");

app.use(express.json());
app.use("/account", accountsRouter);

const port = 3000;
global.fileName = "accounts.json";

app.listen(port, () => {
  try {
    fs.readFile(global.fileName, "utf8", (err, data) => {
      if(err) {
        const initialJson = {
          nextId: 1,
          accounts: []
        };
        fs.writeFile("accounts.json", JSON.stringify(initialJson), err => {
          if(err) {
            console.log(err);
          }
        });
      }

    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }


  console.log('API started!');
});