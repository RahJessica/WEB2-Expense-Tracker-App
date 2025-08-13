const {DataTypes} = require('sequelize');
const sequelize = require('../db');
const { toDefaultValue } = require('sequelize/lib/utils');
const User=sequelize.define('User',{
    id:{
        type: DataTypes.UUID,
        toDefaultValue:DataTypes.UUIDV4,
        primaryKey:true
    },
    email:{
        type: DataTypes.STRING,
        unique: true,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    }
});
module.exports=User;