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
    CREATE TABLE "Party"
    (
        id SERIAL NOT NULL,
        code character varying COLLATE pg_catalog."default" NOT NULL,
        "maxPersonCount" integer,
        CONSTRAINT "Party_pkey" PRIMARY KEY (id),
        CONSTRAINT "Party_code_key" UNIQUE (code)
    );
    
    CREATE TABLE "Relation"
    (
        key character varying(255) COLLATE pg_catalog."default" NOT NULL,
        name character varying(255) COLLATE pg_catalog."default",
        CONSTRAINT "Relation_pkey" PRIMARY KEY (key)
    );

    INSERT INTO "Relation" (key, name) VALUES    
    ('bride','Braut'),
    ('family','Familie'),
    ('friend','Freund/in'),
    ('groom','Bräutigam'),
    ('groomsman','Trauzeuge'),
    ('plus-one','Begleitung'),
    ('witness','Trauzeugin');
    
    CREATE TABLE "User"
    (
        id SERIAL NOT NULL,
        name character varying COLLATE pg_catalog."default" NOT NULL,
        email character varying COLLATE pg_catalog."default",
        phone character varying(255) COLLATE pg_catalog."default",
        accepted boolean,
        "hashedPassword" character varying(255) COLLATE pg_catalog."default",
        "avatarUrl" character varying(255) COLLATE pg_catalog."default",
        scopes json,
        "visibleForOthers" boolean,
        "partyId" integer NOT NULL,
        "relationKey" character varying COLLATE pg_catalog."default" NOT NULL,
        CONSTRAINT "User_pkey" PRIMARY KEY (id),
        CONSTRAINT "User_name_partyId_key" UNIQUE (name, "partyId"),
        CONSTRAINT email UNIQUE (email),
        CONSTRAINT "User_partyId_fkey" FOREIGN KEY ("partyId")
            REFERENCES "Party" (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE,
        CONSTRAINT "User_relationKey_fkey" FOREIGN KEY ("relationKey")
            REFERENCES "Relation" (key) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE NO ACTION
    );
  `);
};

exports.down = (db) => {
  return db.runSql(`
    DROP TABLE IF EXISTS "User";
    DROP TABLE IF EXISTS "Relation";
    DROP TABLE IF EXISTS "Party";
  `);
};
