/* /controllers/expenseController.js */

require("dotenv").config();
const path = require("path");
const Expense = require("../models/expenseModel");
const database = require("../util/database");
const User = require("../models/userModel");
const sequelize = require('../util/database');
const AWS = require("aws-sdk");
const Credit = require("../models/creditExpenseModel");

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

//S3 Services for download and file uploads
  exports.uploadToS3 = (data, filename) => {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
  
    AWS.config.update({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
    });
  
    const s3bucket = new AWS.S3({ params: { Bucket: BUCKET_NAME } });
  
    s3bucket.createBucket(() => {
      const params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
      };
  
      s3bucket.upload(params, (err, s3response) => {
        if (err) {
          console.log('Something went wrong.', err);
        } else {
          console.log('success', s3response);
        }
      });
    });
  };
  
//file downloading 
exports.downloadExpense = async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await Expense.findAll({ where: { userId: userId } });

    // Calculate total expenses
    let totalExpense = 0;
    expenses.forEach((expense) => {
      totalExpense += expense.amount;
    });

    // Get user's income and savings
    const credits = await Credit.findAll({ where: { userId: userId } });
    const income = credits.reduce((acc, credit) => acc + credit.totalIncome, 0);
    // Calculate savings
    const savings = income - totalExpense;

    // Create a CSV string
    let csv = 'Date,Category,Description,Amount\n';
    expenses.forEach((expense) => {
      csv += `${expense.date},${expense.category},${expense.description},${expense.amount}\n`;
    });

    // Add income, savings, and total expense to the CSV string
   
    csv += `\nDebit/ Expenditure,,,${totalExpense}\n`;

    csv += `\nCredit/ Income,,,${income}\n`;
    csv += `"Savings",,,${savings}\n`;

    // Set the content type to CSV and attachment
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=ExpenseReport.csv');

    // Send the CSV content as the response
    res.status(200).send(csv);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
};


  //for pagination
  exports.getAllExpensesforPagination = async (req, res, next) => {
    try {
      const pageNo = req.params.page;
      const limit = 5;
      const offset = (pageNo - 1) * limit;
      const totalExpenses = await Expense.count({
        where: { userId: req.user.id },
      });
      const totalPages = Math.ceil(totalExpenses / limit);
      const expenses = await Expense.findAll({
        where: { userId: req.user.id },
        offset: offset,
        limit: limit,
      });
      res.json({ expenses: expenses, totalPages: totalPages });
    } catch (err) {
      console.log(err);
    }
  };