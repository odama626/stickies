## A simple https file server written in Node

### Simple setup
By default, certs from [letsEncrypt](https://letsencrypt.org/) with [Certbot](https://certbot.eff.org/) are expected.

To get your certificates setup for your domain:

install certbot
```
  #Install in ubuntu
  add-apt-repository ppa:certbot/certbot
  apt-get update
  apt-get install certbot
```

run certbot in standalone mode, where { Your Domain Name } is your domain name
```
  certbot certonly --standalone -d { Your Domain Name }
```

use git to download this package
```
  git clone https://github.com/omarzion/BasicNodeHttpsFileServer.git
```

cd into directory and install
```
  cd BasicNodeHttpsFileServer/
  npm install
```

In cert.js, change myUrl to your domain name

In app.js, change port to whatever port you want (default is 8080)

start with 
```
  node app.js
```

put all the files you want to statically serve in the files folder
