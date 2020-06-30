const router=require("express").Router();
const passport = require ("passport");
const User= require("../models/user-model");
const {List, Item}= require("../models/user-model");
const bodyParser = require("body-parser");



//I have added list-model.js file as well as the route.post for secret in the auth-routes//

passport.use(User.createStrategy());


router.get("/", (req, res) =>{

    res.render("home");
    
    })

router.get("/login", (req, res)=>{

        res.render("login")
})

router.post("/login", (req, res)=>{

    const user= new User({
        username: req.body.username,
        password:req.body.password
    }); 

    req.login(user, (err)=>{
        if(err){
            console.log(err);
            
        }else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets")
            });
        }
    })

    //nowe we use passport to login and authinticate this user. 

});

router.get("/register", (req, res)=>{
    
    res.render("register");
});

router.get("/logout", (req,res)=>{
    
    res.send("logging out");
})

router.get("/auth/google", passport.authenticate("google", {
    scope:["profile", "email"]
}));

router.get('/auth/google/secrets', 
  passport.authenticate('google'),
  (req, res)=> {

    res.redirect('/secrets');
    // Successful authentication, redirect home.
  });


  router.get("/secrets", (req,res)=>{


    User.find({"secret": {$ne:null}}, (err, foundUsers)=>{
    
        if(err){
            console.log(err);
            
        }else{
            if(foundUsers){
            res.render("secrets", {
            usersWithSecrets: foundUsers
        })
        }
    }
    })
    });

    
    router.get("/submit", (req, res)=>{
        if(req.isAuthenticated()){
            res.render("submit")
        }else{
            res.redirect("/login")
        }
    
    });
    
    router.post("/submit", (req, res)=>{
    
        const subSecret= req.body.secret; 
        // console.log(req.user.id);
    
        User.findById(req.user.id, (err, foundUser)=>{
    
            if(err){
                console.log(err)
            }
            else{
                if(foundUser){
                    foundUser.secret=subSecret;
                    foundUser.save(function(){
    
                        res.redirect("secrets");
    
    
                    })
                }
            }
        })
    
    })

    router.get("/auth/logout", (req,res) =>{

        req.logout();
        res.redirect('/');
        
    })


    router.post("/register", (req, res)=>{

        User.register({username: req.body.username}, req.body.password, (err, user)=>{
    
            if(err){
                console.log(err);
                res.redirect("/register");
                
            }else{
                passport.authenticate("local")(req,res, ()=>{
                    res.redirect("/secrets");
                })
            }
    
        })
    
    });

//callback route for google to redirect


module.exports= router;