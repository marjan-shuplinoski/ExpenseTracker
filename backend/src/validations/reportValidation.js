// Joi validation for Reports endpoints (ES Modules)
import Joi from 'joi';

export const reportRangeSchema = Joi.object({
  start: Joi.date().required(),
  end: Joi.date().required(),
});

export const exportFormatSchema = Joi.object({
  format: Joi.string().valid('csv', 'json').required(),
  start: Joi.date().optional(),
  end: Joi.date().optional(),
});

// Middleware for validating summary report query
export function validateReportSummary(req, res, next) {
  const { error } = reportRangeSchema.validate(req.query);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
}

// Middleware for validating monthly report query
export function validateReportMonthly(req, res, next) {
  const { error } = reportRangeSchema.validate(req.query);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
}

// Middleware for validating yearly report query
export function validateReportYearly(req, res, next) {
  const { error } = reportRangeSchema.validate(req.query);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
}

// Middleware for validating export report query
export function validateReportExport(req, res, next) {
  const { error } = exportFormatSchema.validate(req.query);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
}
