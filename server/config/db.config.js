const { Sequelize, Model, DataTypes } = require("sequelize");
const logger = require('../logger/logger');
const pg = require('pg');

const connect = () => {
  const DATABASE_URL = `postgres://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.PG_PORT}/${process.env.DB}`;
  logger.info('connect to database')

  const sequelize = new Sequelize(DATABASE_URL, {
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

  const db = {};
  db.Sequelize = Sequelize;
  db.sequelize = sequelize;
  db.section = require("../model/section.model")(sequelize, DataTypes, Model);
  db.question = require("../model/question.model")(sequelize, DataTypes, Model);

  if (db.section.associate) {
    db.section.associate(db);
  }
  if (db.question.associate) {
    db.question.associate(db);
  }

  return db;
}

module.exports = {
  connect
}
