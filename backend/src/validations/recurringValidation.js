import Joi from 'joi';

export const recurringValidation = Joi.object({
  account: Joi.string().required(),
  category: Joi.string().required(),
  type: Joi.string().valid('income', 'expense', 'transfer').required(),
  amount: Joi.number().required(),
  description: Joi.string().allow(''),
  startDate: Joi.date().required(),
  frequency: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly').required(),
  interval: Joi.number().integer().min(1).default(1),
  endDate: Joi.date().optional().allow(null),
  nextRun: Joi.date().optional(),
  active: Joi.boolean().optional(),
  name: Joi.string().max(100).required(),
});
