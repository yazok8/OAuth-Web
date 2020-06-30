
require('dotenv').config();
const express= require("express"); 
const authRoutes=require("./routes/auth-routes");
const submitRoutes= require("./routes/submit-routes");
const passportSetup= require("./config/passport.setup");
const mongoose = require("mongoose");
const cookieSession = require('cookie-session')
const app= express();
const passport= require("passport"); 
const bodyParser = require("body-parser");
const enforce= require("express-sslify");

if(process.env.NODE_ENV!=="production") require("dotenv").config(); 


app.use(express.static(__dirname + '/public'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

if(process.env.NODE_ENV==="production"){
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
}


app.use(cookieSession({
    maxAge: 24*60*60*1000,
    keys: [process.env.cookiekey]
}));

app.use(passport.initialize());
app.use(passport.session());

//connect to mongodb

mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const connection=mongoose.connection.once('open', () => {
    console.log('Connected to mongodb');
}).on('error',function (error) {
    console.log('CONNECTION ERROR:',error);
});

// setup routes

app.use("/",authRoutes);
app.use("/submit", submitRoutes);


app.get("/", (req, res)=>{

    res.render("home")
})


app.listen(process.env.PORT || 3000, ()=>{
    console.log("app now is running on port 3000");
    
})  