const {DataTypes}=require('sequelize');
const sequelize=require('../db');
const category=sequelize.define('category',{
    
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false       
    },
    description:{
        type:DataTypes.STRING
    }
});
module.exports=category;