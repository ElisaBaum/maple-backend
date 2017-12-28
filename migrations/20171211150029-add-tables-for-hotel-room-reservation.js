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

exports.up = function (db) {
  return db.runSql(`
    CREATE TABLE "HotelRoom"
    (
        id SERIAL NOT NULL,
        description character varying(255) NOT NULL,
        price double precision NOT NULL,
        "maxPersonCount" integer,
        PRIMARY KEY (id)
    );
    
    CREATE TABLE "PartyHotelRoom"
    (
        "partyId" integer NOT NULL,
        "hotelRoomId" integer NOT NULL,
        PRIMARY KEY ("partyId"),
        CONSTRAINT "partyId" FOREIGN KEY ("partyId")
            REFERENCES "Party" (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        CONSTRAINT "hotelRoomId" FOREIGN KEY ("hotelRoomId")
            REFERENCES "HotelRoom" (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
    );
  `);
};

exports.down = function(db) {
  return db.runSql(`
    DROP TABLE IF EXISTS "PartyHotelRoom";
    DROP TABLE IF EXISTS "HotelRoom";
  `);
};

exports._meta = {
  "version": 1
};
