import express from 'express';
import { promises } from "fs";
import cors from "cors";

const router = express.Router();

const readFile = promises.readFile;
const writeFile = promises.writeFile;

router.post("/", async (req, res) => {
  let account = req.body;
  try {
    let data = await readFile("accounts.json", "utf8");
    let json = JSON.parse(data);
    account = { id: json.nextId++, ...account };
    json.accounts.push(account);

    await writeFile("accounts.json", JSON.stringify(json));
    res.end();
    
    logger.info(`POST /account - ${JSON.stringify(account)}`);

  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`POST /account - ${err.message}`);
  }    
});

router.get("/", cors(), async (_, res) => {
  try {
    let data = await readFile(global.fileName, "utf8");
    let accounts = JSON.parse(data);
    delete accounts.nextId;
    res.send(accounts);
    logger.info("GET /account - successfully");
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`GET /account - ${err.message}`);
  }
});

router.get("/:id", async (req, res) => {
  try {
    let data = await readFile(global.fileName, "utf8");
    let json = JSON.parse(data);
    const account = json.accounts.find(account => account.id === parseInt(req.params.id, 10));
    if (account) {
      res.send(account);
      logger.info(`GET /account/:id - ${JSON.stringify(account)}`);
    } else {
      res.end();
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`GET /account/:id - ${err.message}`);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let data = await readFile(global.fileName, "utf8");
    let json = JSON.parse(data);
    let accounts = json.accounts.filter(account => account.id != parseInt(req.params.id, 10));
    json.accounts = accounts;

    await writeFile("accounts.json", JSON.stringify(json));
    res.end();
    
    logger.info(`DELETE /account/:id - ${req.params.id} - successfully`);

  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`DELETE /account/:id - id: ${req.body.id} - error: ${err.message}`);
  }
});

// PUT - atualizar o registro completo
// PATCH - atualizar o registro parcialmente, somente alguns, campos

router.put("/", async (req, res) => {
  let newAccount = req.body;
  
  try {
    let data = await readFile("accounts.json", "utf-8");

    let json = JSON.parse(data);
    let indexAccount = json.accounts.findIndex(account => account.id === newAccount.id);
    json.accounts[indexAccount].name = newAccount.name;
    json.accounts[indexAccount].balance = newAccount.balance;

    await writeFile("accounts.json", JSON.stringify(json));

    res.end();
    logger.info(`PUT /account - ${JSON.stringify(newAccount)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`PUT /account - id: ${req.params.id} - error: ${err.message}`);
  }
});

router.post("/transaction", async (req, res) => {
  
  try {
    let params = req.body;
    let data = await readFile("accounts.json", "utf-8");

    let json = JSON.parse(data);
    let index = json.accounts.findIndex(account => account.id === params.id);
    let newBalance = json.accounts[index].balance + params.value;

    if (newBalance < 0) {
      throw new Error("Saldo insuficiente!");
    }
    json.accounts[index].balance += params.value;

    await writeFile("accounts.json", JSON.stringify(json));
    res.send(json.accounts[index]);
    logger.info(`POST /account/transaction - ${JSON.stringify(params)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`POST /account/transaction - id: ${req.params.id} - error: ${err.message}`);

  }
});

export default router;