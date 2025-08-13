const {DataTypes}=require('sequelize');
const sequelize=require('../db');

const Income=sequelize.define('Income', {
   id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
   },
   amount:{
        type:DataTypes.FLOAT,
        allowNull:false
   },
   description:{
        type:DataTypes.STRING
   },
   date:{
    type:DataTypes.DATE,
    defaultValue:DataTypes.NOW
   }    
});

module.exports=Income;