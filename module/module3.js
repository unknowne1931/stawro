const mongoose = require('mongoose');

const UserinfoSchema = new mongoose.Schema({
    name : String,
    username :String,
    instagramid : String,
    email : String,
    password : String,
    role: {
        default: 'user',
        type : String
    }
    
});
 
module.exports = mongoose.model('User_info', UserinfoSchema)