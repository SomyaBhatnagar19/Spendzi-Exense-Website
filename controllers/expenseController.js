/* /controllers/expenseController.js */

const path = require("path");
const Expense = require("../models/expenseModel");
const database = require("../util/database");
const User = require("../models/userModel");
const sequelize = require('../util/database');
const AWS = require("aws-sdk");
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
    const BUCKET_NAME = "spendzi-expense-tracker-reports";
    const IAM_USER_KEY = "AKIA5D6VUZQBKFDKYUNS";
    const IAM_USER_SECRET = "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";
  
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
  
  exports.downloadExpense = async (req, res) => {
    try {
      const expenses = await Expense.findAll({ where: { userId: req.user.id } });
      const stringifiedExpenses = JSON.stringify(expenses);
      const filename = "Expense.txt";
      exports.uploadToS3(stringifiedExpenses, filename);
      res.status(200).json({ success: true });
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