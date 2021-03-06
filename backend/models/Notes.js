const mongoose = require('mongoose');
const {Schema} = mongoose;

const NotesSchema = new Schema({
    //for hidding particular user notes to another user notes then we will make a new field i.e user. here we can store the user's id
    // user:{
    //     type : mongoose.Schema.Types.ObjectId,
    //     ref : 'user' //this refrence of user from "User.js" file 
    // },

    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    block: {
        type: String,
        required: true
    },
    room: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    image:{
        data:Buffer,
        contentType:String
        // required:true
    }
});

module.exports = mongoose.model('notes', NotesSchema);
