/* /controllers/reportsController.js */

const path = require("path");
const Expense = require("../models/expenseModel");
//Op is an object in sequelize that stores various comparisions like >,< or =.
const { Op } = require("sequelize");

exports.getReportsPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "reports.html"));
};

//Daily expense fetching fucntion from expenses table
exports.dailyReports = async (req, res, next) => {
  try {
    const date = req.body.date;
    const expenses = await Expense.findAll({
      where: { date: date, userId: req.user.id },
    });
    return res.send(expenses);
  } catch (error) {
    console.log(error);
  }
};