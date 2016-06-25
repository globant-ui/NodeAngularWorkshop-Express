'use strict';
module.exports = function(commentsSrv){
  const router = require('express').Router();

  router.post('/', insert);

  return router;

  function insert(req, res){
    console.log("Inserting comment");
    commentsSrv.insert(req.body.parentId, req.body.message)
      .then(comment => res.json(comment));
  }
};