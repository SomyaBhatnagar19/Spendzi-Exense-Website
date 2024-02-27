/* /controllers/resetPasswordController.js */

const path = require("path");
const User = require("../models/userModel");
const ResetPassword = require("../models/resetPasswordModel");
const bcrypt = require("bcrypt");
const Sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const saltRounds = 10;

require("dotenv").config();

const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

//DIRECTING TO THE FORGOT PASSWORD PAGE
const forgotPasswordPage = async (req, res, next) => {
  try {
    res
      .status(200)
      .sendFile(
        path.join(__dirname, "../", "public", "views", "forgotPassword.html")
      );
  } catch (error) {
    console.log(error);
  }
};

//DIRECTING TO THE RESET PASSWORD PAGE
const resetPasswordPage = async (req, res, next) => {
  try {
    const requestId = req.params.requestId;
    res
      .status(200)
      .sendFile(
        path.join(__dirname, "../", "public", "views", "resetPassword.html")
      );
  } catch (error) {
    console.log(error);
  }
};

//FUNCTION WITH LOGIC TO UPDATE THE NEW OPASSWORD
const updatePassword = async (req, res, next) => {
  try {
    const requestId = req.headers.referer.split("/");
    const password = req.body.password;
    const checkResetRequest = await ResetPassword.findAll({
      where: { id: requestId[requestId.length - 1], isActive: true },
    });
    if (checkResetRequest[0]) {
      const userId = checkResetRequest[0].dataValues.userId;
      const result = await ResetPassword.update(
        { isActive: false },
        { where: { id: requestId } }
      );
      const newPassword = await hashPassword(password);
      const user = await User.update(
        { password: newPassword },
        { where: { id: userId } }
      );
      return res
        .status(200)
        .json({
          message: "Successfully changed password! Login with new password.",
        });
    } else {
      return res
        .status(409)
        .json({ message: "Link is already Used Once, Request for new Link!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(409).json({ message: "Failed to change password!" });
  }
};

//FUNCTION TO HANDLE REQUESTS FOR RESET PASSWORD i.e. making new password
const resetPasswordPageWithId = async (req, res, next) => {
  try {
    const requestId = req.params.requestId;
    // Render the reset password page with the requestId for verification
    res
      .status(200)
      .sendFile(
        path.join(__dirname, "../", "public", "views", "resetPassword.html")
      );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to load reset password page." });
  }
};

//FUNCTION TO SEND MAIL LINK FOR RESETING THE NEW PASSWORD
const sendMail = async (req, res, next) => {
  try {
    const email = req.body.email;
    const requestId = uuidv4();

    const recepientEmail = await User.findOne({ where: { email: email } });

    if (!recepientEmail) {
      return res
        .status(404)
        .json({ message: "Please provide the registered email!" });
    }

    const resetRequest = await ResetPassword.create({
      id: requestId,
      isActive: true,
      userId: recepientEmail.id,
    });

    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.SIB_API_KEY;
    const transEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
      email: "spendzi-expense-tracker@gmail.com",
      name: "Spendzi",
    };
    const receivers = [
      {
        email: email,
      },
    ];
    const emailResponse = await transEmailApi.sendTransacEmail({
      sender,
      To: receivers,
      subject: "Spendzi Expense Tracker Reset Password",
      textContent: "Link Below",
      htmlContent: `<h3>The link for your request to reset password is here. Click the link to set new password. >>></h3>
        <a href="http://localhost:3000/password/resetPasswordPage/${requestId}"> Click Here</a>`,
      params: {
        requestId: requestId,
      },
    });
    return res.status(200).json({
      message: "Link successfully sent to your email!",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to send reset password email." });
  }
};

module.exports = {
  forgotPasswordPage,
  resetPasswordPage,
  sendMail,
  updatePassword,
  resetPasswordPageWithId,
};
