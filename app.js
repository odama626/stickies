var express = require('express');
var compression = require('compression');
var cert = require('./cert.js');
var https = require('https');
var pug = require('pug');
var gun = require('gun');

var port = 9000;
var app = express();


app.use(compression());
app.use(express.static('static'));


app.set('view engine', 'pug');

app.get('/', (req, res) => res.render('index.pug', {}));

app.use(gun.serve);
var server = https.createServer(cert, app).listen(port, _ => console.log(`listening on port ${port}`));
gun({ file: 'data.json', web: server});
