const express = require("express");
const app = express();
const users = require("./routes/users");
const products = require("./routes/products");
const cart = require("./routes/cart");
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/users", users);
app.use("/products", products);
app.use("/cart", cart);

app.get("/", (req, res) => {
  res.send("The Server Working!");
});

app.listen(5000, () => {
  console.log(`server is running on 5000`);
});
