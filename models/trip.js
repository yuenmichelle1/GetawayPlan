module.exports = function(sequelize, DataTypes) {
  var Trip = sequelize.define("Trip", {
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    startdate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    enddate: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  Trip.associate = function(models) {
    // We're saying that a Trip should belong to an User
    // A Trip can't be created without an User due to the foreign key constraint
    Trip.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Trip;
};
