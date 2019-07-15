//to start -> npm run start || node server.js
//tuto -> https://www.tutorialspoint.com/nodejs/nodejs_restful_api.htm
var express = require('express');
var app = express();
var fs = require("fs");
const translation = require("./speech-to-translated-speech.js");
var http = require("http");
var url = require("url");
var bodyParser = require("body-parser");

const async = require("async");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

app.get('/languages', function (req, res) {
   fs.readFile( __dirname + "/data/" + "languages.json", 'utf8', function (err, data) {
      console.log( data );
      res.send( data );
   });
})

app.post('/file', function (req, res) {
   console.log(`text :  ${req.body.text} ${req.body.lang}`);
   var translate = translation.vocalTranslator();
   let response = translation.vocalTranslator(req.body.lang,req.body.text);
   response.then(function(value) {
   //  console.log('ICI PD'+value);

      //L'URL est à changer ici
      let rep = 'https://vps696635.ovh.net:8082/'+value[0];


      console.log('rep : '+rep);
      res.send(JSON.stringify({"url":rep, "translation" : value[1], "id" : value[2]}));
      console.log('reponsJSON : ' + JSON.stringify({"url":rep, "translation" : value[1], "id" : value[2]}));
   });
});

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("App listening at http://%s:%s", host, port)
})
