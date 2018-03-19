module.exports = function (sequelize, DataTypes){

    var Trip = sequelize.define("Trip", {
        name:{
            type: DataTypes.STRING,
            allowNull: false,

        },
    })

    Trip.associate = function (models) {
        Trip.hasMany(models.Restaurant)
    };

    Trip.associate = function (models) {
        Trip.hasMany(models.Event)
    };

    Trip.associate = function (models) {
        Trip.belongsTo(models.User)
    };

    return Trip;
}