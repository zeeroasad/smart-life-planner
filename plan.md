# Smart Life Planner implementation plan

## Product approach

Build one plain-local MERN application with a small Express API and a Vite React client. Keep business logic in service modules so a BS Computer Science student can trace the request path: route -> controller -> validator -> service -> model. Use one authenticated user context for budgets, grocery lists, meals, profile preferences, export, and account deletion.

## Design direction

Three possible styles: **sunlit editorial planner** (0.06), **dark data cockpit** (0.07), **clinical wellness grid** (0.05). Choose **sunlit editorial planner**.

- **Design movement:** contemporary editorial dashboard with paper-like surfaces and quiet finance-app precision.
- **Core principles:** calm hierarchy, visible progress, warm utility, and direct language.
- **Color philosophy:** deep ink for trust, cream for a paper workspace, mint for healthy progress, amber for attention, and coral for actionable emphasis.
- **Layout paradigm:** a left rail anchors navigation while the main content uses an asymmetric lead panel followed by compact data rails rather than a centered marketing grid.
- **Signature elements:** a small sunrise mark, pill-shaped status labels, and dotted progress rules connecting the three life areas.
- **Interaction philosophy:** every action confirms its effect in place; destructive actions are separated from routine editing.
- **Animation:** short opacity/translate transitions only for page entry and toast feedback; no distracting continuous motion.
- **Typography system:** system sans for interface clarity with strong weight changes for hierarchy; generous line-height and uppercase eyebrow labels.
- **Brand essence:** one calm control room for money, food, and movement; personal, focused, practical.
- **Brand voice:** headlines are concise and encouraging; CTAs say things like “Plan this week” and “See where your groceries land.”
- **Wordmark:** a simple sunrise arc beside the words “Smart Life Planner”.
- **Signature brand color:** mint `#BFE8D0` against warm cream.

## Backend structure

`app.js` owns middleware and route registration. `server.js` loads configuration, connects MongoDB, and starts listening. Controllers stay thin. Services own domain calculations and AI fallback behavior. Mongoose models define persistence. Refresh tokens are stored as hashes with idle and absolute expiry fields. AI results are cached by user, feature, and a stable input hash.

## Frontend structure

`AuthContext` owns the in-memory access token and refresh-on-load. `services/api.js` owns Axios and one retry-on-401 refresh path. `Layout` supplies navigation and the main shell. Each feature has a page and small reusable cards. Pages call the API, keep local form state, and render the same health and AI disclaimers.

## Verification approach

Run JavaScript syntax checks across server files, load the server module graph without starting a database-dependent listener, smoke-test health and metadata endpoints, and run the Vite production build. MongoDB-dependent flows are verified by code inspection unless a URI is available.
