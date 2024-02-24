/* /models/creditExpenseModel.js */

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../util/database");

const CreditExpense = sequelize.define("CreditExpense", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  description: { type: Sequelize.STRING, unique: false },
  totalIncome: {
    type: Sequelize.INTEGER,
    defaultValue: 0 ,
  },
  totalSaving: {
    type: DataTypes.INTEGER,
    defaultValue: 0 // Default value set to 0
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

module.exports = CreditExpense;