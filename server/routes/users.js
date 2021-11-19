const express = require("express");
const bcrypt = require("bcryptjs");
const sql = require("../connection/connection");
var generator = require("generate-password");
const { verifyToken } = require("../helpers/verifyToken");
const { generateToken } = require("../helpers/utils");
const router = express.Router();

router
  .get("/", verifyToken, async (req, res) => {
    sql.query("SELECT * FROM users", (err, results) => {
      if (err) {
        res.send(err);
      }

      res.json(results);
    });
  })

  .get("/:id", verifyToken, async (req, res) => {
    sql.query("SELECT * FROM users where id = ?", [req.params.id], (err, results) => {
      if (err) {
        res.send(err);
      }

      res.json(results);
    });
  })

  //register-request and done test...
  .post("/register", async (req, res) => {
    sql.query("SELECT * FROM users WHERE email = ?", [req.body.email], (err, results) => {
      const users = results[0];
      if (err) {
        res.send(err);
      }

      if (results.length>0) {
        return res.status(404).send("User is already exist");
      }else {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
        const role = "user";
        const user = [
          req.body.fname,
          req.body.lname,
          req.body.email,
          hashedPassword,
          role
        ];

        sql.query(
          "INSERT INTO users(fname, lname, email, password, role) VALUES(?, ?, ?, ?, ?)",
          [...user],
          (err, result) => {
            if (err) {
              res.status(404).send(err);
            }
            
            res.send({
              id: result.insertId,
              fname: req.body.fname,
              lname: req.body.lname,
              email: req.body.email,
              role: role,
              token: generateToken(req.body)
            });
          }
        );
      }
    });
  })

  //login-request and done test...
  .post("/login", async (req, res) => {
    sql.query("SELECT * FROM users WHERE email = ?", [req.body.email], (err, results) => {
      const user = results[0];
      if (err) {
        res.send(err);
      }

      if (!results.length) return res.status(404).send("User not found");

      if (bcrypt.compareSync(req.body.password, user.password)) {
        delete user.password;
        res.send({
          id: user.id,
          fname: user.fname,
          lname: user.lname,
          email: user.email,
          role: user.role,
          token: generateToken(user)
        });
      } else {
        res.status(404).json({ error: "Password is wrong" });
      } 
    });
  })
















  //---------------------------------------------------------------
  .patch("/updatepass", verifyToken, async (req, res) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    sql.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, req.body.id],
      (err, results) => {
        if (err) {
          res.send(err);
        }

        res.json(results);
      }
    );
  })

  .patch("/resetpassword", (req, res) => {
    const password = generator.generate({
      length: 10,
      numbers: true,
    });
    const hashedPassword = bcrypt.hashSync(password, 10);

    sql.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, req.body.email],
      (err, results) => {
        if (err) {
          res.send(err);
        }
        sendMail(
          req.body.email,
          "180 Daraga | Your New Password Password",
          `Your new password is: ${password}`
        );
        res.json(results);
      }
    );
  })

  .delete("/:id", verifyToken, async (req, res, next) => {
    sql.query("DELETE FROM users WHERE id = ?", [req.params.id], (err, results) => {
      if (err) {
        res.send(err);
      }

      res.json(results);
    });
  });

module.exports = router;