module.exports = (sequelize, DataTypes, Model) => {

  class Section extends Model {}

  Section.init({
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'section' // We need to choose the model name
  });

  return Section;
}
