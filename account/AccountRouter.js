const express = require('express');
const knex = require('../data/dbConfig');
const router = express.Router();

router.get("/", (req, res) => {
    knex
      .select("*")
      .from("accounts")
      .then(accounts => {
        res.status(200).json(accounts);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: "Error getting the posts" });
      });
  });

  module.exports = router;