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

//Felxible expense fetching function from expenses table
exports.flexiReports = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;

    const expenses = await Expense.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
        userId: req.user.id,
      },
      raw: true,
    });

    return res.send(expenses);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

//Monthly expense fetching fucntion from expenses table
exports.monthlyReports = async (req, res, next) => {
  try {
    const month = req.body.month;

    const expenses = await Expense.findAll({
      where: {
        date: {
          [Op.like]: `%-${month}-%`,
        },
        userId: req.user.id,
      },
      raw: true,
    });

    return res.send(expenses);
  } catch (error) {
    console.log(error);
  }
};

