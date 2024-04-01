# Grocery List app

Application for planning shopping list by adding recipes to shopping list. User can browse own recipes or public recipes and add them to shopping list. User can save recipes.

## Istalling

Install client:

`cd client && npm install`

Add .env.production to `/client/.env.production` including:

VITE_API_URI=YOUR_BACKEND_URL

Install server open another conmmand line prompt:

`cd server && npm install`

Add .env to `/server/.env` includind the following:

DATABASE_URL=POSTGRES_DB_CONNECTION_STRING
SERVER: YOUR_BACKEND_URL
PORT: BACKEND_PORT
SECRET: JWT_SECRET

## How to run locally in development mode

Add env. to /grocery-list/server/env.

```
PORT=3001 (if you use different port you need to set it to /grocery-list/client/src/config.ts replace 'http://localhost:3001/api' with your new url: 'http://localhost:<YOUR_PORT>/api')
SECRET=YOU_ARE_FREE_TO_SET_JWT_SECRET_STRING_HERE
DATABASE_URL=postgres://postgres:mysecretpassword@localhost:5432/postgres
SERVER_URL=http://localhost:3001
CLIENT_URL=http://localhost:5173 (this is not neccessary backend will default to http://localhost:5173 if not given)
```

Set up databese:

Migrate and seed database:

`cd server && npm run db:dev-data`

Run the backend:

`cd server && npm run dev`

Run client:

(NOTE: if you add env. to /grocery-list/client/env. with value VITE_API_URI it needs to be removed before deploying to Digital Ocean because then .env.production won't be used on building react app)

`cd client && npm run dev`

## How to deploy

Github actions are set up to run express server and it serves the build react app to client

Add these secrets to your github actions secrets:

PORT: port that your server is using for running express app
DATABASE_URL_PRODUCTION: production postgres connection string
SECRET: jwt secret used for token you can free to chose string here
SERVER_URL: production url

You can get .env file to your production environment by adding:

home/ubuntu_user/ecosystem/ecosystem.config.js:

module.exports = {
apps: [{
name: 'grocerlist',
script: './index.js',
env: {
DATABASE_URL: CONNECTION_STRING,
SERVER: APP_URL,
PORT: EXPRESS_PORT,
SECRET: FREE_TO_CHOOSE_JWT_SECRET,
},
}]
};
