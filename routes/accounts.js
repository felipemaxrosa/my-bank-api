const express = require('express');
const router = express.Router();
const fs = require("fs");

router.post("/", (req, res) => {
  let account = req.body;
  fs.readFile("accounts.json", "utf8", (err, data) => {
    if(!err) {
      try {
        let json = JSON.parse(data);
        account = { id: json.nextId++, ...account };
        json.accounts.push(account);

        fs.writeFile("accounts.json", JSON.stringify(json), err=> {
          if (err) {
            res.status(400).send({ error: err.message });
          } else {
            res.end();
          }
        })
  
      } catch (err) {
        res.status(400).send({ error: err.message });
      }
    } else {
      res.status(400).send({ error: err.message });
    }
    
  })
});

router.get("/", (_, res) => {
  fs.readFile(global.fileName, "utf8", (err, data) => {
    if(!err) {
      let accounts = JSON.parse(data);
      delete accounts.nextId;
      res.send(accounts);
    } else {
      res.status(400).send({ error: err.message });
    }
  });

});

router.get("/:id", (req, res) => {
  fs.readFile(global.fileName, "utf8", (err, data) => {
    try {
      if (err) throw err;
      
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
});

router.delete("/:id", (req, res) => {
  fs.readFile(global.fileName, "utf8", (err, data) => {
    try {
      if (err) throw err;

      let json = JSON.parse(data);
      let accounts = json.accounts.filter(account => account.id != parseInt(req.params.id, 10));
      json.accounts = accounts;

      fs.writeFile("accounts.json", JSON.stringify(json), err=> {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.end();
        }
      });
    } catch (err) {

    }
  });
});

module.exports = router;