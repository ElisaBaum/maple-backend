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
    ALTER TABLE "User" 
      DROP CONSTRAINT "User_name_partyId_key",
      ADD CONSTRAINT "User_name_key" UNIQUE (name),
      ADD COLUMN "lockedUntil" TIMESTAMP,
      ADD COLUMN "failedAuthAttempts" integer
      ;
  `);
};

exports.down = (db) => {
  return db.runSql(`
    ALTER TABLE "User" 
      ADD CONSTRAINT "User_name_partyId_key" UNIQUE (name, "partyId"),
      DROP COLUMN "lockedUntil",
      DROP COLUMN "failedAuthAttempts"
      ;
  `);
};

exports._meta = {
  "version": 1
};
