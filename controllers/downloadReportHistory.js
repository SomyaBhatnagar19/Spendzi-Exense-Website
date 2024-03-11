/* /controllers/downloadReportHistory.js */

const downloadReportHistory = require("../models/downloadReportHistory");

//function to create the data in table
exports.recordDownloadReportHistory = async (req, res) => {
  const userId = req.user.id;
  console.log("Id from recordDownloaDHistory function: ", userId);
  console.log("data from database: ", req.body);
  try {
    // const url = req.data.fileUrl;
    const date = req.body.downloadedAt;
    const resp = await downloadReportHistory.create({
      userId: userId,
      fileUrl: `https://spendzi-expense-tracker-reports.s3.amazonaws.com/${userId}_ExpenseReport.csv`,
      downloadedAt: date,
    });
    console.log("Report history posted from database: ", resp);
    res.status(200).send(resp);
  } catch (err) {
    console.error('Error recording download history:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//function to get the data from table to show history
exports.getDownloadReportHistory = async (req, res) => {
  const userId = req.user.id;
  try {
    const history = await downloadReportHistory.findAll({ where: { userId: userId } });
    console.log("User History from database: ", history);
    res.status(200).send(history);
   
  } catch (err) {
    console.error('Error fetching download history:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};