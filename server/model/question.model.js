module.exports = (sequelize, DataTypes, Model) => {

  class Question extends Model {
    static associate(models) {
      Question.belongsTo(models.section, { foreignKey: 'sectionId', targetKey: 'id' })
    }
  }

  Question.init({
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    type: {
      type: DataTypes.ENUM,
      values: ['singleChoice', 'multipleChoice'],
      allowNull: false
    },
    content: {
      type: DataTypes.ENUM,
      values: ['text', 'image'],
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
    modelName: 'question', // We need to choose the model name
  });

  return Question;
}
