const passport= require("passport"); 
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys= require("./keys");
const User= require("../models/user-model");



passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done)=> {
  User.findById(id).then((user) =>{
    done(null, user);
  });
});


passport.use(new GoogleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: "http://localhost:3000/auth/google/secrets", 
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"

  },(accessToken, refreshToken, profile, done)=>{

    //passport callback function


    console.log(profile);

    User.findOne({googleId: profile.id}).then((currentUser)=>{

      if(currentUser){
        //already have this user
        console.log("user is:", currentUser);
        done(null, currentUser)
        
      }else{
        
        //if not create a new user in our db
        new  User({
          googleId: profile.id, 
          secret: profile.secret,
          username: profile.displayName, 
          email: profile.emails[0].value, 
          thumbnail:profile._json.picture.url
  
      }).save().then((newUser)=>{
        console.log("new user created: " + newUser);
        done(null, newUser);
        
      })


      }
    })

    
    console.log(profile);


  }

));