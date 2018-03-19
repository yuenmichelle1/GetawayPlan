module.exports = function (sequelize, DataTypes){

    var Events = sequelize.define("Event", {
        name:{
            type: DataTypes.STRING,
            allowNull: false,

        }
    })

    // Event.associate = function (models) {
    //     Event.belongsTo(models.Trip, {
    //         onDelete: "cascade"
    //     })}

    return Events;

}