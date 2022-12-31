const { Sequelize, Model, DataTypes } = require("sequelize");
const logger = require('../logger/logger');
const pg = require('pg');

const connect = () => {
  const DATABASE_URL = `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DB}`;
  logger.info('Connecting to database...')

  const sequelize = new Sequelize(process.env.PG_DB, process.env.PG_USER, process.env.PG_PASSWORD, {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    dialect: 'postgres',
    dialectModule: pg,
    pool: {
      max: 10,
      min: 0,
      acquire: 20000,
      idle: 5000
    },
    define: {
      // prevent sequelize from pluralizing table names
      freezeTableName: true,
    }
  });

  (async () => {
    try {
      await sequelize.authenticate();
      console.log("Database connection setup successfully!");
    } catch (error) {
      console.log("Unable to connect to the database", error);
    }
  })();

  const db = {};
  db.Sequelize = Sequelize;
  db.sequelize = sequelize;
  db.section = require("../model/section.model")(sequelize, DataTypes, Model);
  db.question = require("../model/question.model")(sequelize, DataTypes, Model);
  db.answer = require("../model/answer.model")(sequelize, DataTypes, Model);
  db.account = require("../model/account.model")(sequelize, DataTypes, Model);

  if (db.section.associate) {
    db.section.associate(db);
  }
  if (db.question.associate) {
    db.question.associate(db);
  }
  if (db.answer.associate) {
    db.answer.associate(db);
  }

  return db;
}

module.exports = {
  connect
}
