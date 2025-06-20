// Joi validation for Budget endpoints (ES Modules)
import Joi from 'joi';

export const budgetSchema = Joi.object({
  name: Joi.string().required(),
  amount: Joi.number().min(0).required(),
  period: Joi.string().valid('monthly', 'yearly').required(),
  category: Joi.string().optional().allow(null, ''),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
});

/**
 * Joi validation schema for updating a budget.
 * Allows partial updates (PATCH semantics).
 */
export const budgetUpdateSchema = Joi.object({
  name: Joi.string(),
  amount: Joi.number().min(0),
  period: Joi.string().valid('monthly', 'yearly'),
  category: Joi.string().allow(null, ''),
  startDate: Joi.date(),
  endDate: Joi.date(),
}).min(1);

/**
 * Joi validation schema for querying budgets (filters, pagination).
 */
export const budgetQuerySchema = Joi.object({
  period: Joi.string().valid('monthly', 'yearly'),
  category: Joi.string().allow(null, ''),
  startDate: Joi.date(),
  endDate: Joi.date(),
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  sort: Joi.string(),
});
