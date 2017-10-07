import path from 'path';

import tomo from './api/tomo';

const express = require('express');
const app = express();

// Set up HTTP authentication
if (process.env.HTTP_AUTH_USERNAME && process.env.HTTP_AUTH_PASSWORD) {
  var basicAuth = require('basic-auth');
  var requireAuthentication = function (req, res, next) {
    var unauthorized,
        user;

    unauthorized = function (res) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return res.sendStatus(401);
    };

    user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
      return unauthorized(res);
    };

    if (user.name === process.env.HTTP_AUTH_USERNAME && user.pass === process.env.HTTP_AUTH_PASSWORD) {
      return next();
    } else {
      return unauthorized(res);
    }
  };
  app.all('*', requireAuthentication);
}

// Serve static assets
app.use('/assets', express.static(path.join(__dirname, '../client')));

const renderHtmlDocument = function () {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Where should I eat?</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
              rel="stylesheet">
        <link href="/assets/client.css" rel="stylesheet">
        <link href='https://api.mapbox.com/mapbox-gl-js/v0.40.0/mapbox-gl.css' rel='stylesheet' />
      </head>
      <body>
        <div id="app-container">
          <div id="map-container"></div>
          <div id="root-container"></div>
        </div>
        <script src="/assets/client.js"></script>
      </body>
    </html>
  `;
};

// App

app.get('/', function (request, response) {
  response.status(200).send(renderHtmlDocument());
});

app.get('/api/search', function (request, response) {
  console.log('DEBUG: /api/search');
  tomo.search(request.query, function (tomoResponse) {
    response.json(tomoResponse);
  }, function (error) {
    response.status(500).json({
      message: `Error requesting search: request.query, error: ${request.query}, ${error}`
    });
  });
});

var server = app.listen(process.env.PORT || 3000, function () {
  var host,
      port;
  host = server.address().address;
  port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});
