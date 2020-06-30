const passport= require("passport"); 
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User= require("../models/user-model");
const findOrCreate = require('mongoose-findorcreate');
require('dotenv').config();



passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done)=> {
  User.findById(id).then((user) =>{
    done(null, user);
  });
});


passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: "http://localhost:3000/auth/google/secrets", 
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo", 
    proxy: true

  },(accessToken, refreshToken, profile,cb)=>{

    //passport callback function


    console.log(profile._json.picture);

    User.findOne({googleId: profile.id}).then((currentUser)=>{


      if(currentUser){
        //already have this user
        console.log("user is:", currentUser);
        cb(null, currentUser)
        
      }else{
        
        //if not create a new user in our db

        new  User({
          googleId: profile.id, 
          secret: profile.secret,
          username: profile.displayName, 
          email: profile.emails[0].value, 
          thumbnail: profile.photos[0].value
  
      }).save().then((newUser)=>{
        console.log("new user created: " + newUser);
        cb(null, newUser);
        
      })

      }
    })
    console.log(profile);

  }

));

passport.use(new FacebookStrategy({
      clientID: process.env.FB_APP_ID,
      clientSecret: process.env.FB_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/secrets",
      profileFields: ['id', 'emails', 'displayName', 'secret']
    },
    function(accessToken, refreshToken, profile, cb) {
      User.findOne({facebookId: profile.id}).then((currentUser)=>{


        if(currentUser){
          //already have this user
          console.log("user is:", currentUser);
          cb(null, currentUser)
          
        }else{
          
          //if not create a new user in our db
  
          new  User({

            secret: profile.secret,
            username: profile.displayName,
            email:profile.emails[0].value
    
        }).save().then((newUser)=>{
          console.log("new user created: " + newUser);
          cb(null, newUser);
          
        })
  
        }
      })
      console.log(profile);
  
    }
  
  ));