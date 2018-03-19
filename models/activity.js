module.exports = function (sequelize, DataTypes){

    var Activity = sequelize.define("Activity", {
        name:{
            type: DataTypes.STRING,
            allowNull: false,

        },

        address:{
            type: DataTypes.STRING,
            allowNull: false,

        },

        rating:{
            type: DataTypes.FLOAT,

        },

        photo:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "http://www.crosstimbersgazette.com/crosstimbersgazette/wp-content/uploads/2016/02/restaurant-generic.jpg",
            validate: {
                isUrl: true
            }

        }
    })

    Activity.associate = function (models) {
        Activity.belongsTo(models.Trip, {
            onDelete: "cascade"
        })}

    return Activity;
}