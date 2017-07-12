const express = require('express');
const userCreds = require('dotenv').config().parsed;
const jwt = require('jsonwebtoken');

const app = express();

if (!userCreds.CLIENT_SECRET || !userCreds.USERNAME || !userCreds.PASSWORD) {
  throw new Error('Make sure you have a CLIENT_SECRET, USERNAME, and PASSWORD in your .env file');
}

app.set('secretKey', userCreds.CLIENT_SECRET);
const token = jwt.sign('token', app.get('secretKey'));

const checkAuth = (request, response, next) => {
  const authToken = request.body.token ||
                    request.params.token ||
                    request.headers.authorization;

  if (authToken) {
    jwt.verify(authToken, app.get('secretKey'), (error, decoded) => {
      if (error) {
        return response.status(403).send({
          success: false,
          messgae: 'Invalid authorization token',
        });
      } else {
        request.decoded = decoded;
        next();
      }
    });
  } else {
    return response.status(403).send({
      success: false,
      messgae: 'You must be authorized to hit this end point',
    });
  }
};

module.exports = checkAuth;
