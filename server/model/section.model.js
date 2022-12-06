module.exports = (sequelize, DataTypes, Model) => {

  class Section extends Model {
    static associate(models) {
      Section.hasMany(models.question, {
        foreignKey: {
          name: 'sectionId',
          allowNull: false,
        },
        sourceKey: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
      })
    }
  }

  Section.init({
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
    modelName: 'section', // We need to choose the model name
  });

  return Section;
}
