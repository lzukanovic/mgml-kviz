module.exports = (sequelize, DataTypes, Model) => {

  class Question extends Model {}

  Question.init({
    // Model attributes are defined here
    // TODO: removing this enables create calls to work since they have no id of object
    // id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   primaryKey: true
    // },
    sectionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      foreignKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.ENUM,
      // update in postgres types also!
      values: ['singleChoice', 'multipleChoice'],
      allowNull: false
    },
    content: {
      type: DataTypes.ENUM,
      // update in postgres types also!
      values: ['text', 'image'],
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE
    },
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'question' // We need to choose the model name
  });

  return Question;
}
