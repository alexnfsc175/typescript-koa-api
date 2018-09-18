#!/bin/sh

if [ $DB_SEED = "yes" ]; then
  sleep 6 && node database/seeds/run.js
fi

if [ $NODE_ENV = "production" ]; then
  npm install --production --silent && node index.js;
else
  npm install --silent && ./node_modules/nodemon/bin/nodemon.js --inspect=0.0.0.0:9222 --nolazy index.js
fi