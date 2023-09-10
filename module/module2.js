const mongoose = require('mongoose');

const UserphraseSchema = new mongoose.Schema({
    phr1 : String,
    phr2 : String,
    phr3 : String,
    phr4 : String,
    phr5 : String,
    phr6 : String,
    phr7 : String,
    phr8 : String,
    email: String
    
});

module.exports = mongoose.model('User_phrase', UserphraseSchema)