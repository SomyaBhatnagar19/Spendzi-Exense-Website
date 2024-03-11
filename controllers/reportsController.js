/* /controllers/reportsController.js */

const path = require("path");
const Expense = require("../models/expenseModel");
//Op is an object in sequelize that stores various comparisions like >,< or =.
const { Op } = require("sequelize");
const S3Services = require("../services/S3Services");
const Credit = require("../models/creditExpenseModel");

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

exports.downloadExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    // Fetch expenses
    const expenses = await Expense.findAll({ where: { userId: userId } });
    // Calculate total expenses
    let totalExpense = 0;
    expenses.forEach((expense) => {
      totalExpense += expense.amount;
    });
    // Fetch user's credits (income)
    const credits = await Credit.findAll({ where: { userId: userId } });
    let totalIncome = 0;
    credits.forEach((credit) => {
      totalIncome += credit.totalIncome;
    });
    // Calculate savings
    const savings = totalIncome - totalExpense;
    // Create a CSV string
    let csv = 'Date,Category,Description,Amount\n';
    expenses.forEach((expense) => {
      csv += `${expense.date},${expense.category},${expense.description},${expense.amount}\n`;
    });
    // Add income, total expenses, and savings to the CSV string
    csv += `\nTotal Income,,,${totalIncome}\n`;
    csv += `Total Expenses,,,${totalExpense}\n`;
    csv += `Savings,,,${savings}\n`;
    // Set the content type to CSV and attachment
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=ExpenseReport.csv');
    // Send the CSV content as the response
    res.status(200).send(csv);

    // Upload the CSV file to S3
    const filename = `${userId}_${new Date().toISOString()}_ExpenseReport.csv`;
    await S3Services.uploadToS3(csv, filename); // Upload to S3 after generating the CSV

  } catch (err) {
    console.error('Error downloading expenses:', err);
    res.status(500).json({ success: false, error: 'Error downloading expenses' });
  }
};