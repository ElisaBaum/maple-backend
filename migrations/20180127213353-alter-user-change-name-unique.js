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
    CREATE UNIQUE INDEX "user_name_key" ON "User" (LOWER(name));
  `);
};

exports.down = (db) => {
  return db.runSql(`
    DROP INDEX "user_name_key";
  `);
};

exports._meta = {
  "version": 1
};
