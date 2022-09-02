//dependancies
const express = require('express')
const { static, response } = require('express')
const bodyParser = require('body-parser')
const request=require('request');
const path=require('path');
const { Console } = require('console');

const app = express()
const port = process.env.PORT || 3000

//paths
const publicPath=path.join(__dirname,'../public')
const viewsPath=path.join(__dirname,'../views');
app.use(static(publicPath)) //for static css and js

app.use(bodyParser.urlencoded({ extended: false })) //to parse body string

//view engine
app.set("view engine","ejs"); //for dynamic content
app.set("views",viewsPath);

//variables
//var location="http://api.weatherstack.com/current?access_key=688f71630c400096e1cbbfa2ad8996c0&query=";
var city="";
var country="";
var temp=0.0;
var weather="";
var icon="";

app.get('/', (req, res)=>{
    res.render("home");
})

app.get('/weather',(req,res)=>{
    res.render("weather",{
        weather:weather,
        temp:temp,
        city:city,
        icon:icon
    })
})

app.post('/location',(req,res)=>{
    //parsing body variables
    city=req.body.city.toLowerCase();
    country=req.body.country;
    location +=city;
    //api request
    request(location,(error,response)=>{
        data=JSON.parse(response["body"]);
        if(error || data["success"]===false){
            res.redirect("/error");
        }
        else{
            city=(data["location"]["name"])+", "+(data["location"]["region"])+", "+(data["location"]["country"]);
            weather=(data["current"]["weather_descriptions"][0]);
            temp=(data["current"]["temperature"]);
            icon=(data["current"]["weather_icons"][0]);
            res.redirect('/weather');
        }
    });
})

app.get("/error",(req,res)=>{
    res.render("error");
})

app.listen(port, () => console.log(`Server is running on http://localhost:`+port))