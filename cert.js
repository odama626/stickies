var myUrl = 'exceptionallyrecursive.com';


var fs = require('fs');
var location = `/etc/letsencrypt/live/${myUrl}`;

var cert = {
	key: fs.readFileSync(`${location}/privkey.pem`),
	cert: fs.readFileSync(`${location}/fullchain.pem`)
};

module.exports = cert;
