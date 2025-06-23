// Transaction validation schemas (Joi, ESM)
import Joi from 'joi';

export const createTransactionSchema = Joi.object({
  account: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  category: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  type: Joi.string().valid('income', 'expense', 'transfer').required(),
  amount: Joi.number().required(),
  description: Joi.string().allow(''),
  date: Joi.date().required(),
});

export const updateTransactionSchema = Joi.object({
  account: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  category: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  type: Joi.string().valid('income', 'expense', 'transfer'),
  amount: Joi.number(),
  description: Joi.string().allow(''),
  date: Joi.date(),
});
