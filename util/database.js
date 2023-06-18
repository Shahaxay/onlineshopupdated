const {Sequelize}=require('sequelize');
// const Sequelize= require('sequelize').Sequelize;
const sequelize=new Sequelize('node-complete','root','sweetualsubaby',{dialect: 'mysql', host:'localhost'});
module.exports=sequelize;