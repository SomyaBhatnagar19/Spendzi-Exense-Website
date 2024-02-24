/* /controllers/creditExpenseController.js */

const CreditExpense = require("../models/creditExpenseModel");
const Expense = require("../models/expenseModel");

const getCreditExpense = async (req, res) => {
  try {
    const creditExpense = await CreditExpense.findOne({
      where: { userId: req.user.id },
    });
    res.status(200).json({ success: true, data: creditExpense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const addCreditExpense = async (req, res) => {
  try {
    const { description, totalIncome } = req.body;
    const newCreditExpense = await CreditExpense.create({
      description,
      totalIncome,
      userId: req.user.id,
    });
    res.status(201).json({ success: true, data: newCreditExpense });
    console.log('Credit Expense: ', newCreditExpense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const calculateSavings = async (req, res) => {
    try {
      const creditExpense = await CreditExpense.findOne({
        where: { userId: req.user.id },
      });
  
      if (!creditExpense) {
        return res.status(404).json({ success: false, message: "Credit expense not found" });
      }
  
      const expenses = await Expense.findAll({
        where: { userId: req.user.id },
      });
      let totalExpenses = 0;
      for (let expense of expenses) {
        totalExpenses += expense.amount;
      }
      const savings = creditExpense.totalIncome - totalExpenses;
      res.status(200).json({ success: true, data: { savings } });
      console.log('Bachat: ', savings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  

module.exports = { getCreditExpense, addCreditExpense, calculateSavings };
