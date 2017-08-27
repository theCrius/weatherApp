require('dotenv').config();
const express = require('express');
const app = express();

//CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Controllers
const weatherController = require('./controllers/weather');

//Get weather info from dark-sky APIs
app.get('/weather', weatherController.forecast);

//Here we go
app.listen(process.env.PORT || 8101);
console.log(`Service Listening on port ${process.env.PORT || 8101}`);
