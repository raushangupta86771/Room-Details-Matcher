const { Router } = require("express");
const express = require("express");
const app = express();
const multer = require('multer');
const router = express.Router();
const Note = require('../models/Notes') //schema part
const fetchuser = require("../middleware/fetchuser"); //from this middleware we will receieving user
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const nodemailer = require('nodemailer');

const Storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: Storage
}).single('image')


router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id }); //here we will get all the notes. find() - no matter the number of documents matched, a cursor is returned, never null.
        res.json(notes);
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Some error occured");
    }
})



router.post("/matchAndDisplay", async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        upload(req, res, (err) => {
            const newImage = new Note({
                name: req.body.name,
                email: req.body.email,
                block: req.body.block,
                room: req.body.room,
                image: {
                    data: fs.readFileSync("uploads/" + req.file.filename),
                    contentType: 'image/png'
                }
            })
            // Note.find({ $and: [{ room: req.body.room }, { block: req.body.block }] }).then((data)

            // Note.find({ $and: [{ room: req.body.room }, { block: req.body.block }] });

            //(block==block && room==room) && (email!=email)
            Note.find({ $and: [{ room: req.body.room }, { block: req.body.block }], email: { $ne: req.body.email } }).then((data) => {
                var size = Object.keys(data).length;
                if (size >= 1) {
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: "t******an@gmail.com",
                            pass: "oo*****ooo"
                        }
                    })
                    success = true;
                    data.map((currEle) => {
                        var mailOptions = {
                            from: "testmailraushan@gmail.com",
                            to: currEle.email,
                            subject: "We have find you 1st roomate",
                            text: `your first roomate is ${currEle.name} whose email is ${req.body.email}`,
                            html: `<div style="padding:10x;boarder-style:ridge">
                            <p>You have a new contact request</p>
                            <ul>
                                <li>Email : ${req.body.email}</li>
                                <li>Name : ${currEle.name}</li>
                                <li>Block : ${currEle.block}</li>
                                <li>Room No : ${currEle.room}</li>
                                <li>Message : There might be more member please check website once</li>
                            </ul>`
                        };
                        transporter.sendMail(mailOptions, function (er, info) {
                            if (er) {
                                // res.json({ success, data ,resMsg:'Error in Code'});
                                console.log(er);
                            }
                            else {
                                console.log('Email Sent successfully')
                                // res.json({ success, data ,resMsg:'Email Sent successfully'});
                                console.log(info)

                                Note.find({ $and: [{ name: req.body.name }, { email: req.body.email }, { block: req.body.block }, { name: req.body.name }, { room: req.body.room }] }).then((matchingData) => {
                                    if (matchingData.length === 0) {
                                        newImage.save().
                                            then((savedData) => {
                                                // console.log(r.name);
                                                // res.json(r);
                                                console.log("Successflly data inserted....");
                                                res.json({ success, data, resMsg: 'Email Sent successfully', savedData });
                                            }).catch((err) => {
                                                console.log(err);
                                            })
                                    }
                                    else {
                                        console.log("already exist");
                                    }
                                })
                            }
                        })
                    })
                }
                else {
                    Note.find({ $and: [{ name: req.body.name }, { email: req.body.email }, { block: req.body.block }, { name: req.body.name }, { room: req.body.room }] }).then((matchingData) => {
                        if (matchingData.length === 0) {
                            newImage.save().
                                then((savedData) => {
                                    // console.log(r.name);
                                    // res.json(r);
                                    success = false
                                    console.log("Successflly data inserted....");
                                    let count = 1
                                    res.json({ success, savedData, count });
                                }).catch((err) => {
                                    console.log(err);
                                })
                        }
                        else {
                            success = false
                            let count = 0
                            res.json({ success, count });
                            console.log("already exist");
                        }
                    })
                }
            })


            //checking our filling data is ditto matching or not.. if its ditto matching then no need to store again
            // Note.find({ $and: [{ name: req.body.name }, { email: req.body.email }, { block: req.body.block }, { name: req.body.name }, { room: req.body.room }] }).then((data) => {
            //     if (data.length === 0) {
            //         newImage.save().
            //             then((r) => {
            //                 // console.log(r.name);
            //                 // res.json(r);
            //                 console.log("Successflly data inserted....");
            //             }).catch((err) => {
            //                 console.log(err);
            //             })
            //     }
            //     else {
            //         console.log("already exist");
            //     }
            // })
        })
    }
    catch (err) {
        console.log(err);
    }
})



//Route 2 : this end point POST "/api/notes/addnote" . Here we will add note. login required. its taking 4 parameter
router.post("/addnote", fetchuser, [
    // body('number', "Enter a Valid number").isLength({ min: 10 }),
    // body('name', "name at least must be 2 chars").isLength({ min: 2 })
], async (req, res) => {
    //if there are errors then return bad requests and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        upload(req, res, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                const newImage = new Note({
                    name: req.body.name,
                    email: req.body.email,
                    block: req.body.block,
                    room: req.body.room,
                    user: req.user.id,
                    image: {
                        data: req.file.filename,
                        contentType: 'image/png'
                    }
                })
                const result = newImage.save().
                    then(() => {
                        res.status(200).send("Successflly done image");
                        console.log("Successflly done image");
                        // res.setHeader('Content-Type', 'text/html');
                    }).catch((err) => {
                        console.log(err);
                    })
                res.json(result);
            }
        })

    }
    catch (e) {
        console.log(e);
        res.status(500).send("Some error occured");
    }
})



//Route 3 : this end point PUT "/api/notes/updatenote" . Here we update an existing note. login required. its taking 3 parameter
router.put("/updatenote/:id", fetchuser, async (req, res) => {
    const note = await Note.findById(req.params.id);
    if (!note) {
        return res.status(404).send("Not Found");
    }
    // console.log(note._id.toString())
    try {
        upload(req, res, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                const newImage = new Note({
                    name: req.body.name,
                    email: req.body.email,
                    block: req.body.block,
                    room: req.body.room,
                    image: {
                        data: req.file.filename,
                        contentType: 'image/png'
                    }
                })
                // console.log(image);
                Note.findByIdAndUpdate(req.params.id, {
                    name: req.body.name,
                    email: req.body.email,
                    block: req.body.block,
                    room: req.body.room,
                    image: {
                        data: req.file.filename,
                        contentType: 'image/png'
                    }
                }, { new: true }).then((d) => console.log(d)).catch((er) => console.log(er))
                // console.log(noteUpdated);
            }
        })
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Some error occured");
    }
})


//Route 4 : this end point DELETE "/api/notes/deletenote" . Here we delete an existing note. login required. its taking 3 parameter
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    const { title, description, tag } = req.body; //taking user filled data


    //first we will check wether the :id exists or not in database
    const note = await Note.findById(req.params.id); //this will check user url id exists or not
    if (!note) {
        return res.status(404).send("Not Found");
    }

    //"note.user.toString()" is "id" of user entered and "req.user.id" is actual "id" of "logged in user". if both not matched that means the logged in user want to access another user data
    if (note.user.toString() != req.user.id) {
        return res.status(401).send("Not Allowed");
    }

    //"req.params.id" means id which is in user url
    //if it comes to this part then that means the user is authorised and we can allow him to delete
    const deletedNote = await Note.findByIdAndDelete(req.params.id); //here we are updating note
    res.json({ "success": "room details has been deleted" });
})

module.exports = router;
