const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { regval, loginVal } = require("../validation");

// /resgistration 
router.post("/register", async (req, res) => {
    
    // validate user input
    const { error } = regval(req.body);

    if(error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    // check if email exists
    const emailExists = await User.findOne({ email: req.body.email });
    if(emailExists) {
        return res.status(400).json({ error: "email already exists" });
    }

    // password hashing
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);


    // create user and save in db
    const userObject = new User({
        name: req.body.name,
        email: req.body.email,
        password
});
try {
    const savedUser = await userObject.save();
    res.json({ error: null, data: savedUser._id });
} catch (error) {
    res.status(400).json({ error });
}

});
// /login
router.post("/login", async (req, res) => {
    
    // validate user login info
    const { error } = loginVal(req.body);

    if(error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    
    // if login info is valid, find the user
    const user = await User.findOne({ email: req.body.email });

    // throw error if email is wrong
    if(!user) {
        return res.status(400).json({ error: "user doesn't exists" });
    }

    // user exists check for password correctness
    const validPass = await bcrypt.compare(req.body.password, user.password);

    // throw error if password is wrong
    if(!validPass) {
        return res.status(400).json({ error: "password is wrong" });
    }
    // create auth token with username + id
    const token = jwt.sign (
        // payload
        {
            name: user.name,
            id: user._id
        },
        // token secret
        process.env.TOKEN_SECRET, 
        {
            // expiration time
            expiresIn: process.env.JWT_EXPIRES_IN 
        },
    );

    // attach auth token to header
        res.header("auth-token", token).json({
            error: null,
            data: { token }
        });
});

module.exports = router;