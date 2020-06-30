const mongoose= require("mongoose");
const passportLocalMongoose= require("passport-local-mongoose");
const passport = require ("passport");

const findOrCreate = require('mongoose-findorcreate')

const Schema= mongoose.Schema; 

mongoose.set('useCreateIndex', true);

const userSchema= new mongoose.Schema ({
    email: String,
    password: String,
    username: String,
    googleId: String,
    secret: String,
})


userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);





module.exports = User; 