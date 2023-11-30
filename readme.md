OnlineLibrary System Project Repository

This is monorepo contain frontend project using ReactJS and backend project using ExpressJS.

Import the OnlineLibrarySystem.postman_collection.json to postman to test out the back end

### `npm install`

Install package first before npm start

### `.env`

create a file called .env and write the code based on .env.example

### `sequelize-cli db:migrate`

create the tables for the database in MySQL

### `sequelize-cli db:seed:all`

run to populate the data in the database table

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

For API, you can access it in [http://localhost:8000/api](http://localhost:8000/api).

The page will reload if you make edits.

### `npm run clean`

Remove `node_modules` folder from all project.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run serve`

Runs the app in the production mode.

### `npm run client`

Run command on client project.

### `npm run install:client`

Install dependency in client project. Use `npm install:client:dev` for dev dependencies.

### `npm run server`

Run command on server project.

### `npm run install:server`

Install dependency in server project. Use `npm install:server:dev` for dev dependencies.
