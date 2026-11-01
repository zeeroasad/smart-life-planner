# Smart Life Planner

Smart Life Planner is a single MERN web platform for managing a personal budget, grocery shopping, and fitness-oriented meal planning. The modules share one account and one MongoDB database: a meal plan can generate a grocery list, and the grocery list's estimated total is included in the Groceries budget view.

## Assumptions

- The first release targets desktop screens of 1024px and wider.
- A grocery budget is represented by the `Groceries` category and is compared with the sum of grocery-list estimated totals.
- Currency selection changes formatting only; amounts are not converted.
- The local development choice is plain local development. MongoDB may be local or Atlas through `MONGODB_URI`.
- If SMTP is not configured, password reset links are printed to the server console.
- If Groq is not configured or unavailable, deterministic fallback suggestions keep the app usable.

## Functional requirements

- **FR-01 — Must — Authentication and account safety.** Users can register, log in, refresh a short-lived access token, log out, request a password reset, and confirm a reset. **Acceptance:** a user can complete the full flow and the fifth consecutive failed login locks the account temporarily.
- **FR-02 — Must — Shared user scope and privacy.** Every user query is scoped to the logged-in user; users can export their data and delete their account. **Acceptance:** one user cannot read another user's budgets, groceries, meals, or profile.
- **FR-03 — Must — Budget management.** Users can create, update, delete, and review monthly budgets by category. **Acceptance:** the dashboard shows budgeted, spent, and remaining values for the selected month.
- **FR-04 — Must — Grocery management.** Users can create grocery lists, add/edit/check items, and see estimated totals. **Acceptance:** a checked or unchecked grocery item is persisted and the list total updates.
- **FR-05 — Must — Fitness meals.** Users can store meal plans with goal, calorie target, dietary preference, allergies, meals, and nutrition totals. **Acceptance:** a saved meal plan is visible after refresh and displays the health disclaimer.
- **FR-06 — Must — Cross-module connection.** A meal plan can produce a grocery list, and grocery estimated totals count against the `Groceries` budget. **Acceptance:** generating a list from a meal plan creates items and the dashboard's Groceries spend changes.
- **FR-07 — Should — AI assistance.** Groq can suggest a meal plan, generate groceries, and summarize spending using short aggregated prompts, caching, validation, timeout, retry, and fallbacks. **Acceptance:** all three actions return a usable result with no AI key configured, and AI output is Zod-validated when a key is configured.
- **FR-08 — Should — Preferences and currency.** Users can set PKR or another configured display currency plus minimum health inputs. **Acceptance:** amounts reformat after saving a preference without numeric conversion.
- **FR-09 — Must — Admin account controls.** Admins can list, disable, and enable accounts without seeing user domain data. **Acceptance:** an admin endpoint returns account metadata only and disabled users cannot log in.
- **FR-10 — Must — Security baseline.** Passwords are hashed, cookies are HTTP-only, requests are validated, CORS is limited, Helmet and rate limits are enabled, and CSV export neutralizes formula injection. **Acceptance:** invalid input returns the standard error envelope and exported cells cannot begin with spreadsheet formula characters.
- **FR-11 — Could — Optional SMTP delivery.** When SMTP variables exist, reset links can be sent by email. **Acceptance:** the server uses SMTP only when configured and otherwise logs a reset link.

## Stack

- **Server:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Zod, Helmet, express-rate-limit, Nodemailer.
- **Client:** Vite, React, React Router, Tailwind CSS 3, Axios, Recharts.
- **AI:** Groq OpenAI-compatible chat completions through one provider adapter in `server/src/services/aiProvider.js`.

## Folder guide

- `server/src/config` — environment-backed settings and domain constants.
- `server/src/models` — Mongoose schemas only; no business logic.
- `server/src/controllers` — translate HTTP input/output into service calls.
- `server/src/routes` — URL composition and middleware.
- `server/src/services` — business rules and cross-module calculations.
- `server/src/validators` — Zod request schemas.
- `server/src/utils` — response envelopes, tokens, async wrappers, and CSV safety.
- `client/src/pages` — route-level screens.
- `client/src/components` — reusable UI pieces.
- `client/src/context` — authentication state.
- `client/src/services` — Axios API client.

## Setup

1. Install Node.js 20 or newer and run MongoDB locally, or obtain a MongoDB Atlas URI.
2. Copy `server/.env.example` to `server/.env` and set at least `MONGODB_URI`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET`.
3. From `server/`, run `npm install`, then `npm run seed:admin` to create the configured admin.
4. Start the API with `npm run dev` from `server/`.
5. From `client/`, run `npm install` and `npm run dev`.
6. Open the Vite URL shown in the terminal. The Vite proxy forwards `/api` to the server.

On Windows systems where PowerShell blocks `npm.ps1`, use the equivalent `npm.cmd` command (for example, `npm.cmd install` and `npm.cmd run build`).

The application uses the real API and MongoDB backend; when the API is unavailable, requests fail visibly rather than switching to local mock data. Configure `MONGODB_URI` in `server/.env` with your MongoDB Atlas connection string and the actual database-user password. To enable live Groq suggestions, set `AI_API_KEY` in the same file. Never put secrets in client-side environment variables or commit `server/.env`.

## Deploying to Vercel and Railway

The repository includes a root `vercel.json` and `railway.toml` for this monorepo. Connect the GitHub repository to both services and use the repository root as the project/service root:

- **Vercel** builds `client/` and publishes `client/dist`. Add `VITE_API_URL` in the Vercel project's Environment Variables, set to the Railway public URL ending in `/api` (see `client/.env.example`). This is a public API URL, not a secret.
- **Railway** installs and starts `server/`, and checks `/health`. Set `MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and `CLIENT_URL` in the Railway service Variables. Set `CLIENT_URL` to the exact deployed Vercel origin. `COOKIE_SECURE=true` and `COOKIE_SAME_SITE=none` are required for cross-site auth cookies over HTTPS.
- Optionally set `AI_API_KEY` in Railway to enable live Groq suggestions. Railway provides `PORT`; do not hardcode it.

The deployment config files automate build/start behavior, but they cannot create or populate cloud project variables. Add the Railway URL to Vercel and the Vercel origin to Railway after the providers assign their public domains. Use fresh database/API credentials and keep all secrets in Railway, never in Vercel or the repository.

Useful production-style commands:

```powershell
cd server; npm run start
cd client; npm run build
```

## AI privacy and behavior

The server sends Groq only the minimum aggregated values needed for the selected feature: goal, calorie target, allergies/dietary preference, meal names and nutrition fields, grocery item names/quantities, or monthly category totals. It never sends names, emails, account IDs, JWTs, or raw MongoDB documents. Prompts are short, rate-limited, cached in MongoDB, timed out, retried once for HTTP 429, and parsed through Zod. Each AI and meal suggestion shows a visible **not medical or dietary advice** disclaimer.

Groq model availability was checked against the official models and deprecations pages on 2026-11-01. The configured production IDs are `openai/gpt-oss-20b` for fast work and `openai/gpt-oss-120b` for meal plans and insights. The formerly common Llama IDs are listed as retired and are not used.

## API response format

Success responses use `{ success: true, data, message, meta }`. Failures use `{ success: false, error: { code, message } }`. The client uses the same envelope for all requests.

## Not done in this FYP release

Automated tests, social sign-in, bank integrations, food barcode scanning, medical diagnosis, automatic currency conversion, and background job infrastructure are intentionally not included.
