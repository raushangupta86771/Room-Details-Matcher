const { Router } = require("express");
const express = require("express");
const router = express.Router();
const User = require('../models/User') //schema part
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');
var jwt = require("jsonwebtoken");
const JWT_SECRET = "Raushanislege!@####nd"; //secret key for jwt token
const fetchuser = require("../middleware/fetchuser"); //from this middleware we will receieving user

const Storage = multer.diskStorage({
    destination: "user_image",
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: Storage
}).single('image')


//signup of user with image
router.post("/signup", async (req, res) => {
    try {
        upload(req, res, (err) => {
            // const newImage = new User({
            //     name: req.body.name,
            //     email: req.body.email,
            //     password: req.body.password,
            //     image: {
            //         data: fs.readFileSync("user_image/" + req.file.filename),
            //         contentType: 'image/png'
            //     }
            // })
            let emailMatch = true;
            User.findOne({ email: req.body.email }).then((e) => {
                // const len =Object.keys(e).length;  
                if (e) {
                    console.log("email exist");
                    success = false;
                    msg = "Sorry the email already exists !!"
                    return res.json({ msg, success });
                }
                else {
                    console.log("unique...");
                    bcrypt.genSalt(10).then((salt) => {
                        bcrypt.hash(req.body.password, salt).then((ccc) => {
                            const newImage = new User({
                                name: req.body.name,
                                email: req.body.email,
                                password: ccc,
                                image: {
                                    data: fs.readFileSync("user_image/" + req.file.filename),
                                    contentType: 'image/png'
                                }
                            });
                            newImage.save().then((res_data) => {
                                const data = {
                                    user: {
                                        id: newImage.id
                                    }
                                }
                                console.log(res_data.name);
                                const authToken = jwt.sign(data, JWT_SECRET); //here token generated
                                success = true;
                                console.log(authToken)
                                res.json({ success, authToken, res_data }); //sending token to user
                            })
                        })
                    })
                }
            })
        })
    }
    catch (e) {
        console.log(e);
    }

})

router.post("/log", async (req, res) => {
    try {
        upload(req, res, (err) => {
            User.findOne({ email: req.body.email }).then((data) => {
                if (data) {
                    bcrypt.compare(req.body.password, data.password).then((p) => {
                        if (!p) {
                            let success = false;
                            console.log("Incorrect credentials. please check once again");
                            return res.json({ success, error: "Incorrect credentials. please check once again" });
                        }
                        else {
                            const hashmake = {
                                user: {
                                    id: data.id
                                }
                            }
                            const authToken = jwt.sign(hashmake, JWT_SECRET); //here token generated
                            let success = true;
                            res.json({ success, authToken, data });
                            console.log("Logged in successfull...");
                        }
                    })
                }
                else {
                    let success = false;
                    console.log("Incorrect credentials. please check once again");
                    return res.json({success, error: "Incorrect credentials. please check once again" });
                }
            })
        })
    }
    catch (e) {
        console.log(e);
    }
})


//Route 2: Authenticate a user using POST "/api/auth/login". Doesn't require authentication. No login required because here we are logging itself
router.post("/login", [
    body('email', "Enter a Valid email").isEmail(), //if error ocuurs then "Enter a Valid email" msg will pass
    body('password', "Paswword can not be blank").exists(),
], async (req, res) => {
    //if there are errors then return bad requests and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //taking user entered details in relating to its variable
    const email = req.body.email;
    const paswword = req.body.password;

    try {
        let user = await User.findOne({ email });  //matching wether user exists or not. 1st is database email and 2nd is user filled email

        if (!user) //if user does not exist
        {
            // var success = false
            return res.status(400).json({ error: "Incorrect credentials. please check once again" });
        }
        const comparePassword = await bcrypt.compare(paswword, user.password); //user entered password and database hashed password. note :- 1st paswword is user entered and 2nd password is which we got "user" by "User.findOne({email : email})" and it returns true and false
        if (!comparePassword) {
            let success = false;
            return res.status(400).json({ success, error: "Incorrect credentials. please check once again" });
        }

        //if it reaches to this part that means the user entered credential is true. and now we will generate token for that login
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET); //here token generated
        let success = true;
        res.json({ success, authToken });
        console.log("Logged in successfull...");
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Occured");
    }
})


//Route 3: Get logged in user details using POST "api/auth/getuser". Login required
router.post("/getuser", fetchuser, async (req, res) => {
    try {
        //here 2nd argunemt is middleware and we are using middleware to get the user id and we can use that middleware at any instance of time when we need to get user data by authentication. and that middleware is in "middleware/fetchuser.js" location. and this is in harry 51th video of react js
        //"fetchuser" is imported from middleware

        const userId = req.user.id; //suppose here we fetched logged in user id from middleware 

        const user = await User.findById(userId).select("-password"); //then here we will fetch "that user all data from mongo db expecpt password by the help of id"

        res.send(user);
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Occured");
    }
})


module.exports = router;