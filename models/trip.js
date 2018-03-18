module.exports = function(sequelize, DataTypes) {
  var Trip = sequelize.define("Trip", {
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    startdate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    enddate: {
      type: DataTypes.DATEONLY,
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
};
