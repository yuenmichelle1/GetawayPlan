
module.exports = function (sequelize, DataTypes){

    var Trip = sequelize.define("Trip", {
        name:{
            type: DataTypes.STRING,
            defaultValue: "Your Trip",

        },
        location:{
            type: DataTypes.STRING,
            allowNull: false,

        },
        startdate: {
            type: DataTypes.STRING,
            allowNull: false
      },
        enddate: {
            type: DataTypes.STRING,
            allowNull: false
        }
//         background_photo:{
//             type: DataTypes.STRING,
//             allowNull: false,

//         }
    })

    // Trip.associate = function (models) {
    //     Trip.hasMany(models.Activity)
    // };

    Trip.associate = function (models) {
        Trip.hasMany(models.Restaurant);
        Trip.hasMany(models.Activity);
    };

    Trip.associate = function (models) {
        Trip.belongsTo(models.User, {
            onDelete: "cascade"
        })
    };

    return Trip;
}

