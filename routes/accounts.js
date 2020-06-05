const express = require('express');
const router = express.Router();
const fs = require("fs").promises;

router.post("/", async (req, res) => {
  let account = req.body;
  try {
    let data = await fs.readFile("accounts.json", "utf8");
    let json = JSON.parse(data);
    account = { id: json.nextId++, ...account };
    json.accounts.push(account);

    await fs.writeFile("accounts.json", JSON.stringify(json));
    res.end();

  } catch (err) {
    res.status(400).send({ error: err.message });
  }    
});

router.get("/", async (_, res) => {
  try {
    let data = await fs.readFile(global.fileName, "utf8");
    let accounts = JSON.parse(data);
    delete accounts.nextId;
    res.send(accounts);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let data = await fs.readFile(global.fileName, "utf8");
    let json = JSON.parse(data);
    const account = json.accounts.find(account => account.id === parseInt(req.params.id, 10));
    if (account) {
      res.send(account);
    } else {
      res.end();
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let data = await fs.readFile(global.fileName, "utf8");
    let json = JSON.parse(data);
    let accounts = json.accounts.filter(account => account.id != parseInt(req.params.id, 10));
    json.accounts = accounts;

    await fs.writeFile("accounts.json", JSON.stringify(json));
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// PUT - atualizar o registro completo
// PATCH - atualizar o registro parcialmente, somente alguns, campos

router.put("/", async (req, res) => {
  let newAccount = req.body;
  
  try {
    let data = await fs.readFile("accounts.json", "utf-8");

    let json = JSON.parse(data);
    let indexAccount = json.accounts.findIndex(account => account.id === newAccount.id);
    json.accounts[indexAccount].name = newAccount.name;
    json.accounts[indexAccount].balance = newAccount.balance;

    await fs.writeFile("accounts.json", JSON.stringify(json));

    res.end();
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.post("/transaction", async (req, res) => {
  
  try {
    let params = req.body;
    let data = await fs.readFile("accounts.json", "utf-8");

    let json = JSON.parse(data);
    let index = json.accounts.findIndex(account => account.id === params.id);
    let newBalance = json.accounts[index].balance + params.value;

    if (newBalance < 0) {
      throw new Error("Saldo insuficiente!");
    }
    json.accounts[index].balance += params.value;

    await fs.writeFile("accounts.json", JSON.stringify(json));
    res.send(json.accounts[index]);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = router;