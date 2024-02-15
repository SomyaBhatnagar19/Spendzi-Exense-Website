/* /controllers/userController.js */
require('dotenv').config();
const path = require("path");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../util/database");

function generateAccessToken(id, email, isPremiumUser) {
  return jwt.sign(
    { userId: id, email: email, isPremiumUser: isPremiumUser },
    "1937683932020310230484786355"
  );
}
// const generateAccessToken = (userId, userEmail) => {
//   const token = jwt.sign({ userId, userEmail }, "1937683932020310230484786355", { expiresIn: '1h' });
//   return token;
// };

// const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization;

//   if (!token) {
//     return res.status(401).json({ success: false, message: 'Unauthorized: Missing token' });
//   }

//   jwt.verify(token, "1937683932020310230484786355", (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ success: false, message: 'Forbidden: Invalid token' });
//     }

//     req.user = decoded;
//     next();
//   });
// };

const isPremiumUser = async (req, res, next) => {
  try {
    if (req.user && req.user.isPremiumUser) {
      return res.json({ isPremiumUser: true });
    } else {
      return res.json({ isPremiumUser: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getLoginPage = async (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, "../", "public", "views", "login.html"));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const postUserSignUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email: email } });

    if (existingUser) {
      return res.status(409).send(
        `<script>alert('This email is already taken. Please choose another one.'); window.location.href='/'</script>`
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    res.status(200).send(
      `<script>alert('User Created Successfully!'); window.location.href='/'</script>`
    );

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to handle user login
const postUserLogin = (req, res, next) => {
  const email = req.body.loginEmail;
  const password = req.body.loginPassword;
  User.findOne({ where: { email: email } }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Something went Wrong!" });
        }
        if (result == true) {
          return res.status(200).json({
            success: true,
            message: "Login Successful!",
            token: generateAccessToken(user.id, user.email),
          });
        } else {
          return res.status(401).json({
            success: false,
            message: "Password Incorrect!",
          });
        }
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User doesn't Exists!",
      });
    }
  });
};


const getAllUsers = (req, res, next) => {
  User.findAll({
    attributes: [
      [sequelize.col("name"), "name"],
      [sequelize.col("totalExpenses"), "totalExpenses"],
    ],
    order: [[sequelize.col("totalExpenses"), "DESC"]],
  }).then((users) => {
    const result = users.map((user) => ({
      name: user.getDataValue("name"),
      totalExpenses: user.getDataValue("totalExpenses"),
    }));
    res.send(JSON.stringify(result));
  });
};

module.exports = {
  generateAccessToken,
  getLoginPage,
  postUserLogin,
  postUserSignUp,
  getAllUsers,
  isPremiumUser,
};

