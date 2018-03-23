

module.exports = function (sequelize, DataTypes){

    var Restaurant = sequelize.define("Restaurant", {
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
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: "http://www.crosstimbersgazette.com/crosstimbersgazette/wp-content/uploads/2016/02/restaurant-generic.jpg",
            validate: {
                isUrl: true
            }
        },
        
        directions: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }
        }
    })

    Restaurant.associate = function (models) {
        Restaurant.belongsTo(models.Trip, {
            onDelete: "cascade"
        })}

    return Restaurant;

}