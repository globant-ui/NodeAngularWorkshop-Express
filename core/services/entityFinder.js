'use strict';

const Promise = require('bluebird');
const COMMENT = require('../types/documentTypes').COMMENT;

class EntityFinderService {
  constructor(db, type){
    this.db = db;
    this.type = type;
  }

  findAll(){
    return new Promise((resolve, reject) => {
      this.db.find({ docType: this.type }, (err, docs) => {
        if(err) return reject(err);

        if(0 === docs.length) return resolve(null);

        return resolve(docs);
      });
    });
  }

  find(_id){
    return new Promise((resolve, reject) => {
      this.db.findOne({ docType: this.type, _id }, (err, doc) => {
        if(err) return reject(err);

        if(!doc) return resolve(null);

        this.db.count({ docType: COMMENT, parentKey: _id }, (err, count) => {
          if(err) return reject(err);

          doc.commentsCount = count;
        });

        return resolve(doc);
      });
    });
  }
}

module.exports = EntityFinderService;