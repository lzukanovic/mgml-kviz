module.exports = (sequelize, DataTypes, Model) => {

  class Account extends Model { }

  Account.init({
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'account', // We need to choose the model name
  });

  return Account;
}
