'use strict';

const Datastore = require('nedb');

const db = new Datastore({
  filename: 'datastore/workshop.db',
  autoload: true,
  timestampData: true
});

let data = [{
  band: require('./data/beatles_band'),
  artists: require('./data/beatles_artists'),
  albums: require('./data/beatles_albums'),
  tracks: [
    require('./data/beatles_album_1_tracks'),
    require('./data/beatles_album_2_tracks'),
    require('./data/beatles_album_3_tracks'),
    require('./data/beatles_album_4_tracks'),
    require('./data/beatles_album_5_tracks'),
    require('./data/beatles_album_6_tracks')
  ]
},{
  band: require('./data/metallica_band'),
  artists: require('./data/metallica_artists'),
  albums: require('./data/metallica_albums'),
  tracks: [
    require('./data/metallica_album_1_tracks'),
    require('./data/metallica_album_2_tracks'),
    require('./data/metallica_album_3_tracks'),
    require('./data/metallica_album_4_tracks'),
    require('./data/metallica_album_5_tracks')
  ]
}];

data.forEach(insertIntoDB);

function insertIntoDB(collection){
  db.insert(collection.band, (e, band) => {
    let bandQuery = {_id: band._id};
    db.insert(collection.artists, (e, artists) => {
      band.artists = artists.map(a => a._id);
    });

    db.insert(collection.albums, (e, albums) => {
      band.albums = albums.map(a => a._id);

      albums.forEach((album, i) => {
        db.insert(collection.tracks[i], (e, tracks) => {
          album.tracks = tracks.map(t => t._id);
          db.update({ _id: album._id }, album);
        });
      });
    });

    db.update(bandQuery, band);
  });
}