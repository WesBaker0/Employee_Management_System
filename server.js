const dotenv = require('dotenv');
dotenv.config();

const routes = require('./controllers/routes.js');

routes.startApp();