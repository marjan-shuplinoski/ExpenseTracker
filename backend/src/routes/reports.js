/**
 * Financial reports API routes.
 * @module routes/reports
 * @requires express
 * @requires controllers/reportsController
 */

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get financial reports for the authenticated user
 */

import express from 'express';
import { validateReportSummary, validateReportMonthly, validateReportYearly, validateReportExport } from '../validations/reportValidation.js';
import { requireAuth } from '../middleware/security.js';
import * as reportsController from '../controllers/reportsController.js';

const router = express.Router();

// GET /api/reports/summary
router.get('/summary', requireAuth, validateReportSummary, reportsController.getSummaryReport);

// GET /api/reports/monthly
router.get('/monthly', requireAuth, validateReportMonthly, reportsController.getMonthlyReport);

// GET /api/reports/yearly
router.get('/yearly', requireAuth, validateReportYearly, reportsController.getYearlyReport);

// GET /api/reports/export
router.get('/export', requireAuth, validateReportExport, reportsController.exportReport);

export default router;
