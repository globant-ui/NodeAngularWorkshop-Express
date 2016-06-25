const Datastore = require('nedb');

const db = new Datastore({
  filename: 'datastore/workshop.db',
  autoload: true
});

db.remove({}, { multi: true });
