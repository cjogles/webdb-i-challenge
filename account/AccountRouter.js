const express = require('express');
const knex = require('../data/dbConfig');
const router = express.Router();

function validateAccount(req, res, next) {
    const accountBody = req.body;
    if (!accountBody) {
        res.status(400).json({error: 'Missing Account Data.'});
      } else if (!accountBody.name || !accountBody.budget) {
        res.status(400).json({error: 'Missing required Account fields: name or budget.'});
      } else {
        next();
      }
}

router.get("/", (req, res) => {
    knex
      .select("*")
      .from("accounts")
      .then(accounts => {
        res.status(200).json(accounts);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: "Error getting the accounts" });
      });
  });

  router.get("/:id", (req, res) => {
    // select * from posts where id = req.params.id
    knex
      .select("*")
      .from("accounts")
      // .where("id", "=", req.params.id)
      .where({ id: req.params.id })
      .first() // equivalent to posts[0]
      .then(account => {
        res.status(200).json(account);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: "Error getting the account" });
      });
  });
  
  router.post("/", validateAccount, (req, res) => {
    // insert into () values ()
    const accountData = req.body;
  
    // please validate postData before calling the database
    // knex.insert(postData).into('posts')
    // second argument "id") will show a warning on console when using SQLite
    // it's there for the future (when we move to MySQL or Postgres)
    knex("accounts")
      .insert(accountData, "id")
      .then(ids => {
        // returns and array of one element, the id of the last record inserted
        const id = ids[0];
  
        return knex("accounts")
          .select("id", "name", "budget")
          .where({ id })
          .first()
          .then(account => {
            res.status(201).json(account);
          });
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          errorMessage: "Error adding the account"
        });
      });
  });
  
  router.put("/:id", (req, res) => {
    const { id } = req.params;
    const changes = req.body;
  
    // validate the data
    knex("accounts")
      .where({ id }) // ALWAYS FILTER ON UPDATE (AND DELETE)
      .update(changes)
      .then(count => {
        if (count > 0) {
          res.status(200).json({ message: `${count} record(s) updated` });
        } else {
          res.status(404).json({ message: "Account not found" });
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          errorMessage: "Error updating the account"
        });
      });
  });
  
  router.delete("/:id", (req, res) => {
    knex("accounts")
      .where({ id: req.params.id }) // ALWAYS FILTER ON UPDATE (AND DELETE)
      .del()
      .then(count => {
        res.status(200).json({ message: `${count} record(s) removed` });
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          errorMessage: "Error removing the account"
        });
      });
  });
  module.exports = router;