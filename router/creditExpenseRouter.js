/* /router/creditExpenseRouter.js */

const express = require("express");
const router = express.Router();
const creditExpenseController = require("../controllers/creditExpenseController");
const auth = require("../middleware/auth");

router.get("/creditExpense", auth, creditExpenseController.getCreditExpense);
router.post("/creditExpense", auth, creditExpenseController.addCreditExpense);
router.get("/creditExpense/savings", auth, creditExpenseController.calculateSavings);

module.exports = router;
