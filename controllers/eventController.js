

module.exports = function (sequelize, DataTypes){

    var Event = sequelize.define("Event", {
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

        },
        url: {
            type: DataTypes.STRING,
            validate: {
                isUrl: true
            }
        }
    })

    Event.associate = function (models) {
        Event.belongsTo(models.Trip, {
            onDelete: "cascade"
        })}

    return Restaurant;

}