'use strict'
const request = require('request-promise');

const weatherController = {
  forecast
}
module.exports = weatherController;

//Loading constants from .env
const dsKey = process.env.dsKey
, dsURL = process.env.dsURL+dsKey
, dsOptions = process.env.dsOptions;
let dsLastQuery = {
  requestUrl: undefined,
  response: undefined
}

//Loading constants from .env
const pKey = process.env.pKey
, pURL = process.env.pURL+pKey+process.env.pOptions;
let pLastQuery = {
  requestUrl: undefined,
  response: undefined
}

function forecast(req, res) {
  const coords = req.query;
  console.log(`${dsURL}/${coords.latitude},${coords.longitude}/${dsOptions}`);
  if (dsLastQuery.requestUrl == `${dsURL}/${coords.latitude},${coords.longitude}/${dsOptions}`) {
    res.send(dsLastQuery.response);
  } else {
    dsLastQuery.requestUrl = `${dsURL}/${coords.latitude},${coords.longitude}/${dsOptions}`;
    request(dsLastQuery.requestUrl)
    .then(function (response) {
      dsLastQuery.response = JSON.parse(response);
      __getImage(dsLastQuery.response.currently.icon)
      .then((img) => {
        dsLastQuery.response.currently.image = img;
        res.send(dsLastQuery.response);
      })
      .catch((err) => {
        console.log(`[WARN] Image not fetched`, err);
        dsLastQuery.response = JSON.parse(response);
        res.send(dsLastQuery.response);
      })
    })
    .catch(function (err) {
      console.error(`[ERR] Request failed`, err);
      res.status(500).send(err);
    });
  }
}

//Get custom images from Pixabay, if the request match the last, use the stored response (pixabay enforce this rule)
function __getImage(key) {
  console.log(`${pURL}weather+${key.replace('-', '+')}`);
  return new Promise((resolve, reject) => {
    if (pLastQuery.requestUrl == `${pURL}weather+${key.replace('-', '+')}`) {
      resolve(pLastQuery.response);
    } else {
      pLastQuery.requestUrl = `${pURL}weather+${key.replace('-', '+')}`;
      request(pLastQuery.requestUrl)
      .then(function (response) {
        response = JSON.parse(response);
        pLastQuery.response = response.hits[0].webformatURL;
        resolve(pLastQuery.response);
      })
      .catch(function (err) {
        reject(err);
      });
    }
  });
}
