const express = require("express");
const hbs = require("hbs");

var {Show} = require("./models/shows");
var {mongoose} = require("./database/db");
var {imdbGetData} = require("./imdb/imdb-promise.js");

var app = express();
app.set("view engine", "hbs");
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');


app.get("/", (req, res) => {
  res.redirect("/shows");
});

hbs.registerHelper("daysUntilShow", (date) => {
  var currentYear = (new Date()).getFullYear();
  var showYear = date.split(" ")[2]
  console.log(showYear);
  if (showYear < currentYear){
    return "false";
  }
  var datenum = new Date(Date.parse(date.split(" ")[1] +" 1, 2012")).getMonth()+1
  var dateday = date.split(" ")[0]
  var tday= new Date(), y= tday.getFullYear(), next= new Date(y, datenum-1, dateday);
  tday.setHours(0, 0, 0, 0);
  if(tday>next) next.setFullYear(y+1);
  return Math.round((next-tday)/8.64e7);
});

app.get("/shows", (req, res) => {
  var ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null);
     console.log(ip)

  Show.find({}).then((show) => {
    res.render("index.hbs", {show});
  });
});

app.get("/shows/:id", (req, res) => {
  var id = req.params.id;
  console.log(id)
  Show.find({_id: id}).then((doc) => {
    res.render("show", (doc))
  }, (e) => {
    res.status(400).send(e);
  })
});

app.get("/test", (req, res) => {

  imdbGetData("tt2193021").then((show) => {
      var test = new Show({
        showData: show,
      });
      test.save().then((doc) => {
        console.log(doc.seasons)
      })
      res.send("Added to db..");
    });
});



app.listen(3000, () => {
  console.log("Server started on port 3000.");
});
