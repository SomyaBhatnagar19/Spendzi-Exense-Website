/* /Models/userModel.js */

//users table creating

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  isPremiumUser: {
    type: DataTypes.BOOLEAN,
    defaultValue: false // Default value set to false
  },
  totalExpenses: {
    type: DataTypes.INTEGER,
    defaultValue: 0 // Default value set to 0
  }
});

module.exports = User;
