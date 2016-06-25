'use strict';
const AlbumsService = require('../core/services/albumsService');
const BandsService = require('../core/services/bandsService');

const THROW = require('../utils/throwError');
const Types = require('../core/types/documentTypes');

function generateAPI(finderSrv, commentsSrv){
  const router = require('express').Router();

  router.get('/', findAll);

  router.get('/:id', find);

  router.get('/:id/comments', findComments);

  return router;

  function findAll(req, res){
    finderSrv.findAll()
      .then(docs => {
        if(!docs) return res.send(404);

        return res.json(docs);
      })
      .catch(THROW(res));
  }

  function find(req, res){

  }

  function findComments(req, res){

  }
}


module.exports = {
  albumsRoutes(db, commentsSrv){
    return generateAPI(new AlbumsService(db), commentsSrv);
  },

  bandsRoutes(db, commentsSrv){
    return generateAPI(new BandsService(db, new AlbumsService(db)), commentsSrv);
  },
  commentsRoutes: require('./comments')
};
