/* /controllers/expenseController.js */

require("dotenv").config();

const path = require("path");
const jwt = require("jsonwebtoken");
const Expense = require("../models/expenseModel");
const database = require("../util/database");
const User = require("../models/userModel");
const sequelize = require('../util/database');
const AWS = require("aws-sdk");
const Credit = require("../models/creditExpenseModel");
const S3Sevices = require("../services/S3Services");

exports.getHomePage = async (req, res, next) => {
  try {
    res.sendFile(
      path.join(__dirname, "../", "public", "views", "homePage.html")
    );
  } catch {
    (err) => console.log(err);
  }
  };
  
  exports.addExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
      const date = req.body.date;
      const category = req.body.category;
      const description = req.body.description;
      const amount = req.body.amount;
      
      await User.update(
        {
          totalExpenses: req.user.totalExpenses + Number(amount),
        },
        { where: { id: req.user.id } },
        { transaction: t }
      );

      await Expense.create(
        {
          date: date,
          category: category,
          description: description,
          amount: amount,
          userId: req.user.id,
        },
        { transaction: t }
      )
        .then((result) => {
          res.status(200);
          res.redirect("/homePage");
        })
        .catch((err) => {
          console.log(err);
        });
      await t.commit();
    } catch {
      async (err) => {
        await t.rollback();
        console.log(err);
      };
    }
  };
  
  exports.getAllExpenses = async (req, res, next) => {
    try {
      const expenses = await Expense.findAll({ where: { userId: req.user.id } });
      res.json(expenses);
    } catch (err) {
      console.log(err);
    }
  };
  
  exports.deleteExpense = async (req, res, next) => {
    const id = req.params.id;
    console.log(id);
    try {
      const expense = await Expense.findByPk(id);
      await User.update(
        {
          totalExpenses: req.user.totalExpenses - expense.amount,
        },
        { where: { id: req.user.id } }
      );
      await Expense.destroy({ where: { id: id, userId: req.user.id } });
      res.redirect("/homePage");
    } catch (err) {
      console.log(err);
    }
  };
  
  exports.editExpense = async (req, res, next) => {
    try {
      const id = req.params.id;
      console.log(req.body);
      const category = req.body.category;
      const description = req.body.description;
      const amount = req.body.amount;
  
      const expense = await Expense.findByPk(id);
  
      await User.update(
        {
          totalExpenses: req.user.totalExpenses - expense.amount + Number(amount),
        },
        { where: { id: req.user.id } }
      );

      await Expense.update(
        {
          category: category,
          description: description,
          amount: amount,
        },
        { where: { id: id, userId: req.user.id } }
      );
  
      res.redirect("/homePage");
    } catch (err) {
      console.log(err);
    }
  };


/* ------------------------------------------------------------S3SERVICES---------------------------------------------------------------------------  */ 


//functionality for downloading expense report using S3
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
    const filename = `${userId}_ExpenseReport.csv`;
    await S3Sevices.uploadToS3(csv, filename);

  } catch (err) {
    console.error('Error downloading expenses:', err);
    res.status(500).json({ success: false, error: 'Error downloading expenses' });
  }
};

/* ---------------------------------------------------------PAGINATION---------------------------------------------------------------------------------  */
  //for pagination
  // exports.getAllExpensesforPagination = async (req, res, next) => {
  //   try {
  //     const pageNo = req.params.page;
  //     // const limit = 5;
  //     let limit = parseInt(req.query.limit) || 5; 
  //     const offset = (pageNo - 1) * limit;
  //     const totalExpenses = await Expense.count({
  //       where: { userId: req.user.id },
  //     });
  //     const totalPages = Math.ceil(totalExpenses / limit);
  //     const expenses = await Expense.findAll({
  //       where: { userId: req.user.id },
  //       offset: offset,
  //       limit: limit,
  //     });
  //     res.json({ expenses: expenses, totalPages: totalPages });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  exports.getAllExpensesforPagination = async (req, res) => {
    try {
      const pageNo = req.params.page;
      const pageSize = req.query.limit || 5; // Default page size is 5 if not provided
      console.log("page no.: ", pageNo);
      console.log("page size: ", pageSize);
      const expenses = await Expense.findAll({
        where: { userId: req.user.id },
        limit: parseInt(pageSize), // Convert pageSize to an integer
        offset: (pageNo - 1) * pageSize,
        order: [["createdAt", "DESC"]],
      });
  
      const totalExpenses = await Expense.count({ where: { userId: req.user.id } });
      const totalPages = Math.ceil(totalExpenses / pageSize);
  
      res.status(200).json({ expenses, totalPages });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  