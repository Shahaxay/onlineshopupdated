const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const OS_user=sequelize.define("shopping_user",{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports=OS_user;