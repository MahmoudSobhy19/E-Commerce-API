const jwt = require("jsonwebtoken");

module.exports = { 
    generateToken: (user) => {
        return jwt.sign({
            id: user.id,
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            role: user.role
        }, 
        process.env.SECRET_JWT, 
        {
            expiresIn:'1d'
        });
    }
};