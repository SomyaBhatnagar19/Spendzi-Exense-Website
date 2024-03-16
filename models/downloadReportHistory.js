/* /models/downloadReportHistory.js */

const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const DownloadReportHistory = sequelize.define('downloadReportHistory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  downloadedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
});

module.exports = DownloadReportHistory;