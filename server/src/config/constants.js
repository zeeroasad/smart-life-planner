import { config } from './env.js';

export const BUDGET_CATEGORIES = config.budgetCategories;
export const SUPPORTED_CURRENCIES = config.supportedCurrencies;
export const FITNESS_GOALS = ['maintain', 'lose', 'gain', 'performance'];
export const DIETARY_PREFERENCES = ['balanced', 'vegetarian', 'vegan', 'high-protein', 'low-carb', 'halal'];
export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];
export const MAX_FAILED_LOGINS = 5;
export const LOCKOUT_MINUTES = 15;
export const AI_DISCLAIMER = 'AI suggestions are not medical or dietary advice. Review them with a qualified professional.';
