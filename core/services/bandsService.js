'use strict';

const Promise = require('bluebird');

const Types = require('../types/documentTypes');
const ARTIST = Types.ARTIST;
const ALBUM = Types.ALBUM;
const BAND = Types.BAND;

class BandsService {
  constructor(db, AlbumsService){
    this.db = db;
    this.albumsService = AlbumsService;
  }

  findAll() {
    return new Promise((resolve, reject) => {
      this.db.find({ docType: BAND }, (err, bands) => {
        if (err) return reject(err);

        let total = bands.length;
        let current = 0;
        if (0 === total) return resolve(null);

        bands.forEach((band, i) => {
          let complexQuery = {
            $and: [
              {
                docType: ARTIST
              }, {
                _id: { $in: band.artists }
              }]};

          this.db.find(complexQuery, (err, artists) => {
            if (err) return reject(err);

            bands[i].artists = artists;

            if(total === ++current) {
              resolve(bands);
            }
          });
        });
      });
    });
  }

  find(_id) {
    return new Promise((resolve, reject) => {
      this.db.findOne({docType: BAND, _id}, (err, band) => {
        // TODO: Usar albumService.findByBand y buscar en la base de datos los artistas de la banda.

      });
    });
  }
}

module.exports = BandsService;
