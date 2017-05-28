var express = require('express');
var compression = require('compression');
var cert = require('./cert.js');
var https = require('https');
var pug = require('pug');
var gun = require('gun');

var port = 9000;
var app = express();

app.use(compression());
app.use(express.static('dist'));

  /*
 *  Helper functions
 */

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}



app.set('view engine', 'pug');

app.get('/', (req, res) => res.render('index.pug', {}));


app.get('/private', (req, res) => {
  res.render('private.pug');
})

app.get('/public', (req, res) => {
  res.render('public.pug');
});

app.get('/public/:space', (req, res) => {
  res.render('space.pug', { title: capitalize(req.params.space) });
});

app.get('/:company', (req, res) => {
  res.render('company.pug');
});

app.get('/:company/:space', (req, res) => {
  res.render('space.pug');
});

app.use(gun.serve);
var server = https.createServer(cert, app).listen(port, _ => console.log(`listening on port ${port}`));
gun({ file: 'data.json', web: server});