const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  verifyToken: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; //Bearer ${TOKEN}

    if (token === null) return res.status(401).send({ message: "No token, authorization denied" });
    jwt.verify(token, process.env.SECRET_JWT, (err, user) => {
      if (err) {
        return res.status(403).send({ message: "Invalid token" });
      }
      req.user = user;
      next();
    });
  },
  verifyAdminstration: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; //Bearer ${TOKEN}

    if (token === null) return res.status(401).send({ message: "No token, authorization denied" });
    jwt.verify(token, process.env.SECRET_JWT, (err, user) => {
      if (err) {
        return res.status(403).send({ message: "Invalid token" });
      }
      if (user.role !== "admin") {
        return res.status(403).send({ message: "You are not authorized" });
      }
      req.user = user;
      next();
    });
  },
};