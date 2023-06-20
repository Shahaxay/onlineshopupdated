const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const OrderItem=sequelize.define("orderItem",{
    id:{
        type:Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement:true
        
    },
    quantity: Sequelize.INTEGER
});

module.exports=OrderItem;