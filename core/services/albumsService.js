'use strict';

const Promise = require('bluebird');
const Types = require('../types/documentTypes');
const ALBUM = Types.ALBUM;
const COMMENT = Types.COMMENT;
const TRACK = Types.TRACK;
const BAND = Types.BAND;

class AlbumsService {
  constructor(db){
    this.db = db;
  }

  findAll(){
    return new Promise((resolve, reject) => {
      this.db.find({ docType: ALBUM }, (err, docs) => {
        if(err) return reject(err);

        let total = docs.length;
        let current = 0;
        if(0 === total) return resolve(null);

        docs.forEach((doc, i) => {
          let complexQuery = {
            $and: [
              {
                docType: TRACK
              }, {
                _id: { $in: doc.tracks }
              }]};

          this.db.find(complexQuery, (err, tracks) => {
            if(err) return reject(err);
            
            docs[i].tracks = tracks;

            if(total === ++current) resolve(docs);
          });
        });
      });
    });
  }

  /**
   * Find all the albums that belong to a band
   * @deprecated
   * @param _id The band id
   * @returns {Promise} Returns a Promise than when solved returns all the albums
   */
  findByBand(_id){
    return new Promise((resolve, reject) => {
      this.db.findOne({ $and: [ { docType: BAND }, { _id: _id }]}, (err, band) => {
        if(err) return reject(err);

        if(!band) return resolve(null);

        let complexQuery =  {
          $and: [
            {
              docType: ALBUM
            }, {
              _id: { $in: band.albums }
            }]};

        this.db.find(complexQuery, (err, albums) => {
          if(err) return reject(err);

          const total = albums.length;
          let current = 0;
          if(0 === total) return resolve(null);

          let albumPromises = [];
          albums.forEach(album => {
            albumPromises.push(this.find(album._id));

            if(total === ++current){
              resolve(Promise.all(albumPromises))
            }
          });
        });
      });
    });
  }

  find(_id){
    return new Promise((resolve, reject) => {
      this.db.findOne({ $and: [ { docType: ALBUM }, { _id: _id }] }, (err, album) => {
        if(err) return reject(err);

        if(!album) return resolve(null);
        
        let complexQuery = {
          $and: [
            {
              docType: TRACK
            }, {
              _id: { $in: album.tracks }
            }]};
        
        this.db.find(complexQuery, (err, tracks) => {
          if(err) return reject(err);

          let total = tracks.length;
          let current = 0;

          if(0 === total) resolve(album);

          tracks.forEach(t => {
            this.db.count({ $and: [{ docType: COMMENT}, {parentKey: t._id}] }, (err, count) => {
              if(err) return reject(err);
              t.commentsCount = count;

              if(total === ++current) {
                album.tracks = tracks;
                resolve(album);
              }
            })
          });
        });
      });
    });
  }
}

module.exports = AlbumsService;