'use strict';
const PORT = 1338;

const Datastore = require('nedb');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const api = require('./api');

const db = new Datastore({
  filename: 'datastore/workshop.db',
  autoload: true
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/albums', api.albumsRoutes());

app.listen(PORT, () => console.log(`App started and listening on port ${PORT}`));
