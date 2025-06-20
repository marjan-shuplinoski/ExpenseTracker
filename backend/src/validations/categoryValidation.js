// Joi validation for Category (ES Modules)
import Joi from 'joi';

export const createCategorySchema = Joi.object({
  name: Joi.string().trim().required(),
  type: Joi.string().valid('income', 'expense').required(),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().trim(),
  type: Joi.string().valid('income', 'expense'),
});
// Note: ES Modules only. No CommonJS allowed.
