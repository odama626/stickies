#! node

const { execSync } = require("child_process");
const { name, version } = require('./package.json');


// execSync('yarn build', { stdio: 'inherit'});
execSync(`docker build -t ${name}:${version} -t ${name}:latest --build-arg BUILD_CONTEXT=stickies-service ../..`, { stdio: 'inherit'})