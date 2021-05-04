
var http = require('http');
var fs = require('fs');
var url = require('url');
var path    = require("path");
var express = require('express');

//var session = require('cookie-session'); // Charge le middleware de sessions
//var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
//var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();
app.use(express.static('./'));

app.get('/1', function(req, res) {
     res.sendFile(path.join(__dirname+ '/index2.html'));
});

app.get('/2', function(req, res) {
     res.sendFile(path.join(__dirname+ '/index3.html'));
});

app.listen(8888);