const express = require('express');
const fs = require('fs').promises;
const app = express();
const accountsRouter = require("./routes/accounts");

app.use(express.json());
app.use("/account", accountsRouter);

const port = 3000;
global.fileName = "accounts.json";

app.listen(port, async () => {
  try {
    await fs.readFile(global.fileName, "utf8");
    console.log('API started!');
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: []
    };

    await fs.writeFile("accounts.json", JSON.stringify(initialJson));
    res.status(400).send({ error: err.message });
  }
});