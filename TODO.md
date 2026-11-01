# Smart Life Planner delivery checklist

- [x] **Authentication and account safety:** register, log in, refresh a short-lived access token, rotate HTTP-only refresh cookies, log out, request/confirm reset links, and lock an account after five failed logins.
- [x] **Shared user scope and privacy:** scope user queries, add JSON/CSV export, and add account deletion.
- [x] **Budget management:** create, update, delete, and review monthly budgets by category; show budgeted, spent, and remaining values.
- [x] **Grocery management:** create lists, add/edit/check items, persist changes, and calculate estimated totals.
- [x] **Fitness meals:** save meal plans with goal, calories, dietary preference, allergies, meals, totals, and the health disclaimer.
- [x] **Cross-module connection:** generate grocery items from a meal plan and include grocery estimated totals in the Groceries budget calculation.
- [x] **AI assistance:** implement Groq adapter, short privacy-preserving prompts, caching, Zod validation, timeout, one 429 retry, rate limiting, visible disclaimers, and deterministic no-key fallbacks.
- [x] **Preferences and currency:** support configured display currencies and minimum health inputs without conversion.
- [x] **Admin account controls:** seed an admin and allow metadata-only account listing, disable, and enable operations.
- [x] **Security baseline:** hashing, JWT/refresh handling, validation, CORS, Helmet, rate limits, and CSV-injection protection.
- [x] **Documentation:** include assumptions, requirements FR IDs, architecture, Groq privacy notes, setup, and not-done items in README.
- [ ] **Automated tests:** intentionally not done for this FYP release.
