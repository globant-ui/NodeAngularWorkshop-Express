'use strict';
const PORT = 1338;

const cors = require('cors');
const Datastore = require('nedb');
const express = require('express');
const bodyParser = require('body-parser');

const api = require('./api');

// TODO: Usar 'datastore/workshop.db' para levantar la base de datos.

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/bands', api.bandsRoutes(db, commentsSrv));
app.use('/albums', api.albumsRoutes(db, commentsSrv));
app.use('/tracks', api.tracksRoutes(db, commentsSrv));
app.use('/artists', api.artistsRoutes(db, commentsSrv));
app.use('/comments', api.commentsRoutes(commentsSrv));

app.listen(PORT, () => console.log(`App started and listening on port ${PORT}`));
