module.exports = function (sequelize, DataTypes){

    var Activity = sequelize.define("Activity", {
        name:{
            type: DataTypes.STRING,
            allowNull: false
        },

        photo:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "https://www.sciencedaily.com/images/2016/04/160406124740_1_900x600.jpg",
            validate: {
                isUrl: true
            }
        },

        url: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        
        directions: {
            type: DataTypes.STRING,
            allowNull: true,
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