'use strict';
const AlbumsService = require('../core/services/albumsService');
const BandsService = require('../core/services/bandsService');
const EntityFinderService = require('../core/services/entityFinder');

const THROW = require('../utils/throwError');
const Types = require('../core/types/documentTypes');
const TRACK = Types.TRACK;
const ARTIST = Types.ARTIST;

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
    finderSrv.find(req.params.id)
      .then(doc => {
        if(!doc) return res.send(404);

        return res.json(doc);
      })
      .catch(THROW(res));
  }

  function findComments(req, res){
    commentsSrv.find(req.params.id)
      .then(docs => {
        if(!docs) return res.json([]);

        return res.json(docs);
      })
      .catch(THROW(res));
  }
}


module.exports = {
  albumsRoutes(db, commentsSrv){
    return generateAPI(new AlbumsService(db), commentsSrv);
  },
  tracksRoutes(db, commentsSrv){
    return generateAPI(new EntityFinderService(db, TRACK), commentsSrv);
  },
  artistsRoutes(db, commentsSrv){
    return generateAPI(new EntityFinderService(db, ARTIST), commentsSrv);
  },
  bandsRoutes(db, commentsSrv){
    return generateAPI(new BandsService(db, new AlbumsService(db)), commentsSrv);
  },
  commentsRoutes: require('./comments')
};
