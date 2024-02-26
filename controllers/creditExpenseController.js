/* /controllers/creditExpenseController.js */

const User = require("../models/userModel");
const CreditExpense = require("../models/creditExpenseModel");
const Expense = require("../models/expenseModel");

const getCreditExpense = async (req, res) => {
  try {
    const creditExpense = await CreditExpense.findOne({
      where: { userId: req.user.id },
    });

    if (!creditExpense) {
      return res.status(404).json({ success: false, message: "Credit expense not found" });
    }

    // Calculate totalIncomeSum
    const creditExpenses = await CreditExpense.findAll({
      where: { userId: req.user.id },
    });
    const totalIncomeSum = creditExpenses.reduce((acc, expense) => acc + parseFloat(expense.totalIncome), 0);

    // Calculate totalSavingsSum
    const expenses = await Expense.findAll({
      where: { userId: req.user.id },
    });
    let totalExpenses = 0;
    for (let expense of expenses) {
      totalExpenses += expense.amount;
    }
    const totalSavingsSum = totalIncomeSum - totalExpenses;

    res.status(200).json({ success: true, data: creditExpense, totalIncomeSum, totalSavingsSum });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const addCreditExpense = async (req, res) => {
  try {
    const { description, totalIncome, totalSavings } = req.body;
    const newCreditExpense = await CreditExpense.create({
      description,
      totalIncome,
      totalSavings, // Include totalSavings in the creation of the CreditExpense
      userId: req.user.id,
    });

    // Calculate the sum of all totalIncome
    const creditExpenses = await CreditExpense.findAll({
      where: { userId: req.user.id },
    });
    const totalIncomeSum = creditExpenses.reduce((acc, expense) => acc + parseFloat(expense.totalIncome), 0);

    // Calculate savings
    const expenses = await Expense.findAll({
      where: { userId: req.user.id },
    });
    let totalExpenses = 0;
    for (let expense of expenses) {
      totalExpenses += expense.amount;
    }
    const totalSavingsSum = totalIncomeSum - totalExpenses;

    res.status(201).json({ success: true, data: newCreditExpense, totalIncomeSum, totalSavingsSum });
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

    // Calculate totalIncomeSum
    const creditExpenses = await CreditExpense.findAll({
      where: { userId: req.user.id },
    });
    const totalIncomeSum = creditExpenses.reduce((acc, expense) => acc + parseFloat(expense.totalIncome), 0);

    // Calculate totalSavingsSum
    const expenses = await Expense.findAll({
      where: { userId: req.user.id },
    });
    let totalExpenses = 0;
    for (let expense of expenses) {
      totalExpenses += expense.amount;
    }
    const totalSavingsSum = totalIncomeSum - totalExpenses;

    // Update the totalSavings field in the CreditExpense table
    await CreditExpense.update({ totalSavings: totalSavingsSum }, {
      where: { userId: req.user.id },
    });
    console.log('Savings: ', totalSavingsSum);
    res.status(200).json({ success: true, data: { totalIncomeSum, totalSavingsSum } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getCreditExpense, addCreditExpense, calculateSavings };
