const express = require("express");
const sql = require("../connection/connection");

const router = express.Router();

router.get("/", (req, res) => {
  sql.query("SELECT * FROM products", (err, result) => {
    if (err) res.send(err)

    res.send(result)
  })
})

module.exports = router;