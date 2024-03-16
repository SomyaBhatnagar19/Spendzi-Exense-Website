/* /router/downloadReportHistory.js.js */

const express = require("express");
const router = express.Router();
const downloadReportHistoryController = require("../controllers/downloadReportHistory");;
const userAuthentication = require("../middleware/auth");

router.post(
  "/downloadReportHistory",
  userAuthentication,
  downloadReportHistoryController.recordDownloadReportHistory
);

router.get(
  "/showDownloadReportHistory",
  userAuthentication,
  downloadReportHistoryController.getDownloadReportHistory
)

module.exports = router;
