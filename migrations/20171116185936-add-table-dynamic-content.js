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
    CREATE TABLE "DynamicContent"
    (
        key character varying(255) NOT NULL,
        content json NOT NULL,
        PRIMARY KEY (key)
    );
  `);
};

exports.down = (db) => {
  return db.runSql(`
    DROP TABLE IF EXISTS "DynamicContent";
  `);
};

exports._meta = {
  "version": 1
};
