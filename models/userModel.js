/* /Models/userModel.js */

//users table creating

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  isPremiumUser: DataTypes.BOOLEAN,
  totalExpenses: DataTypes.INTEGER
});

module.exports = User;
