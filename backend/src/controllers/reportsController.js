// Reports controller for ExpenseTracker (ES Modules)
import { getSummaryData, getMonthlyData, getYearlyData, getExportData } from '../services/reportsService.js';
import { handleError } from '../middleware/security.js';

export async function getSummaryReport(req, res, next) {
  try {
    const data = await getSummaryData(req.user, req.query);
    res.json({ success: true, data });
  } catch (err) {
    handleError(err, req, res, next);
  }
}

export async function getMonthlyReport(req, res, next) {
  try {
    const data = await getMonthlyData(req.user, req.query);
    res.json({ success: true, data });
  } catch (err) {
    handleError(err, req, res, next);
  }
}

export async function getYearlyReport(req, res, next) {
  try {
    const data = await getYearlyData(req.user, req.query);
    res.json({ success: true, data });
  } catch (err) {
    handleError(err, req, res, next);
  }
}

export async function exportReport(req, res, next) {
  try {
    const { fileBuffer, fileName, mimeType } = await getExportData(req.user, req.query);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', mimeType);
    res.send(fileBuffer);
  } catch (err) {
    handleError(err, req, res, next);
  }
}
