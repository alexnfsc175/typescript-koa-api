#!/bin/sh

if [ $DB_SEED = "yes" ]; then
  sleep 6 && npm run seed
  # sleep 6 && node src/database/seeds/run.js
fi

if [ $NODE_ENV = "production" ]; then
  npm install --production --silent && npm run start;
  # npm install --production --silent && node index.js;
else
  npm install --silent && npm run start:dev
  # npm install --silent && DEBUG=rbac npm run start:dev
  # npm install --silent && ./node_modules/nodemon/bin/nodemon.js --inspect=0.0.0.0:9222 --nolazy src/index.js
fi