module.exports = (sequelize, DataTypes, Model) => {

  class Answer extends Model {
    static associate(models) {
      Answer.belongsTo(models.question, { foreignKey: 'questionId', targetKey: 'id' });
    }
  }

  Answer.init({
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    text: {
      type: DataTypes.TEXT,
    },
    imageName: {
      type: DataTypes.STRING
    },
    imageType: {
      type: DataTypes.STRING
    },
    imageData: {
      type: DataTypes.BLOB
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
    modelName: 'answer', // We need to choose the model name
  });

  return Answer;
}
