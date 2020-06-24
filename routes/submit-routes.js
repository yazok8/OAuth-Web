const router= require("express").Router();

const User = require("../models/user-model");

const authCheck = (req, res, next)=>{

    if(!req.user){

    //if user is not logged in
        res.redirect("/login")
    }

    else{
        //if user is logged in
        next();
    }

};

router.get("/", authCheck, (req, res)=>{
    
    res.render("secrets", {
        user: req.user
    })

})






module.exports = router;    