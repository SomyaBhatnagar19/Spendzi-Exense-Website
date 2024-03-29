/* /server.js */

//main file

// Load environment variables

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

// Connecting the database connection
const sequelize = require("./util/database");
const morgan = require("morgan");

const app = express();

const cors = require("cors");
app.use(cors());

const dotenv = require("dotenv");
dotenv.config();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

// Use morgan middleware for logging HTTP requests
app.use(morgan("combined", { stream: accessLogStream }));

// Body parser middleware
app.use(express.json()); // For parsing application/json
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes
const userRouter = require("./router/userRouter");
const expenseRouter = require("./router/expenseRouter");
const purchaseMembershipRouter = require("./router/purchaseMembershipRouter");
const leaderboardRouter = require("./router/leaderboardRouter");
const resetPasswordRouter = require("./router/resetPasswordRouter");
const reportsRouter = require("./router/reportsRouter");
const creditExpenseRouter = require("./router/creditExpenseRouter");
const downloadReportHistory = require("./router/downloadReportHistory");

//for login & signup route
app.use("/", userRouter);
//for leaderboard route
app.use("/user", userRouter);
app.use("/homePage", expenseRouter);
app.use("/expense", expenseRouter);
app.use("/purchase", purchaseMembershipRouter);
app.use("/premium", leaderboardRouter);
app.use("/password", resetPasswordRouter);
app.use("/reports", reportsRouter);
app.use("/credit", creditExpenseRouter);
app.use("/history", downloadReportHistory);

//Associations
const User = require("./models/userModel");
const Expense = require('./models/expenseModel');
const Order = require("./models/ordersModel");
const ResetPassword = require("./models/resetPasswordModel");
const CreditExpense = require("./models/creditExpenseModel");
const History = require("./models/downloadReportHistory");

User.hasMany(Expense, { foreignKey: 'userId' });
Expense.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Order);
Order.belongsTo(User);

ResetPassword.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(ResetPassword, { foreignKey: 'userId' });

CreditExpense.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(CreditExpense, { foreignKey: 'userId' });

History.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(History, { foreignKey: 'userId' });

// Start the server
sequelize.sync().then(() => {
  const PORT = process.env.PORT || 3000;
  // console.log(`${process.env.PORT}`);
  app.listen(PORT , () => {
    console.log(`Server is listening on port ${PORT}.`);
  });
}).catch((error) => {
  console.error("Unable to connect to the database:", error);
});
