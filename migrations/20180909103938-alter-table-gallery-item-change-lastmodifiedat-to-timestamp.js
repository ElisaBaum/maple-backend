'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = (db) => {

  return db.runSql(`
    ALTER TABLE "GalleryItem" 
      ALTER COLUMN "lastModifiedAt" TYPE timestamp
      ;
  `);
};

exports.down = (db) => {
  return db.runSql(`
    ALTER TABLE "GalleryItem" 
      ALTER COLUMN "lastModifiedAt" TYPE date
      ;
  `);
};

exports._meta = {
  "version": 1
};
