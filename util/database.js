/* /util/database.js */

//file that stores the mysql data for connection

const Sequelize = require('sequelize');

const sequelize = new Sequelize('spenzi-expense-website', 'root', 'Somya@1901b', {
  host: 'localhost',
  dialect: 'mysql', 
});

module.exports = sequelize;
