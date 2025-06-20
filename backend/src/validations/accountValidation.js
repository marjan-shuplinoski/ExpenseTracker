// Account validation schemas (Joi, ESM)
import Joi from 'joi';

export const createAccountSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().valid('cash', 'bank', 'credit', 'investment', 'other').required(),
  balance: Joi.number().min(0).default(0),
  currency: Joi.string().default('USD'),
});

export const updateAccountSchema = Joi.object({
  name: Joi.string(),
  type: Joi.string().valid('cash', 'bank', 'credit', 'investment', 'other'),
  balance: Joi.number().min(0),
  currency: Joi.string(),
});
