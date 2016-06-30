'use strict';

const Promise = require('bluebird');
const COMMENT = require('../types/documentTypes').COMMENT;

class CommentsService{
  constructor(db){
    this.db = db;
  }

  find(parentKey){
    return new Promise((resolve, reject) => {
      this.db.find({ docType: COMMENT, parentKey }).sort({ ts: -1 }).exec((err, docs) => {
        if(err) return reject(err);

        if(0 === docs.length) return resolve(null);

        return resolve(docs);
      });
    });
  }

  insert(parentKey, message){
    return new Promise((resolve, reject) => {
      this.db.insert({ docType: COMMENT, parentKey, message, ts: Date.now() }, (err, docs) => {
        if(err) return reject(err);

        return resolve(docs);
      });
    });
  }
}

module.exports = CommentsService;