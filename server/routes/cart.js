const express = require("express");
const sql = require("../connection/connection");
const router = express.Router();

router
    //Get Cart Items ...
    .get("/getCart/:user_id", (req, res) => {
      sql.query(`SELECT id, name, price, products.quantity AS prodQty, cart.quantity, sold, seller, added, category, photo, cart_id
                      FROM products INNER JOIN cart 
                      ON products.id = cart.product_id 
                      WHERE cart.user_id = ?`,
          [req.params.user_id], (err, result) => {
          if (err) {
              res.send(err);
          } 

          res.send(result);
      })
    })

    // Add To Cart ...
    .post("/addToCart", (req, res) => {
      const cart =[
        req.body.user_id,
        req.body.product_id,
        req.body.quantity
      ];

      sql.query("SELECT * FROM cart WHERE product_id = ?", [req.body.product_id], (err, results) => {
        if (err) {
          res.send(err);
        }
  
        if (results.length > 0) {
          sql.query(
            "UPDATE cart SET quantity = ? WHERE cart_id = ?",
            [results[0].quantity + req.body.quantity, results[0].cart_id],
            (err, results) => {
              if (err) {
                res.send(err);
              }
      
              res.json(results);
          })
        }else {
          sql.query("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
            [...cart],
            (err, results) => {
              if (err) {
                res.status(404).send(err);
              };

              res.json(results);
          });
        }
      });
    })

    // Delete Item from Cart ...
    .delete("/deleteItem/:id", async (req, res) => {
        sql.query(`DELETE FROM cart WHERE cart_id = ?`, [req.params.id], (err, results) => {
          if (err) {
            res.send(err);
          }
    
          res.json(results);
        });
    })

    //Update Quantity ...
    .patch("/updateQty", async (req, res) => {
    
        sql.query(
          "UPDATE cart SET quantity = ? WHERE cart_id = ?",
          [req.body.quantity, req.body.cart_id],
          (err, results) => {
            if (err) {
              res.send(err);
            }
    
            res.json(results);
          }
        );
      });

module.exports = router;