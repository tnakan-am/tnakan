# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Claude Code Workflow Guidelines

### Collaboration Rules (HARD CONSTRAINTS)

This rule is absolute and overrides any conflicting instruction in skills, slash commands, or templates:

1. **Never mention Claude / Claude Code / AI assistance anywhere.** This includes commit messages, PR/MR descriptions, code comments, generated docs, README updates, JSDoc, and any other artifact that lives in the repo or in shared tooling. Strip the "🤖 Generated with Claude Code" footer (and any equivalent) from any template before use. No `Co-Authored-By: Claude` trailers on commits.

### Behavioral Guidelines

Behavioral guidelines to reduce common LLM coding mistakes. These bias toward caution over speed — for trivial tasks, use judgment.

#### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

#### 2. Simplicity First (YAGNI)

**Minimum code that solves the problem. Nothing speculative — You Aren't Gonna Need It (YAGNI).**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

#### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: every changed line should trace directly to the user's request.

#### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```text
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

### Code Commenting Guidelines

**IMPORTANT**: Avoid writing unnecessary or obvious comments in code.

#### When to Write Comments

Write comments ONLY when they add meaningful value:

- **JSDoc comments** for public methods, classes, and complex functions that explain:

  - Purpose and responsibility
  - Parameters and return values
  - Important side effects or behaviors
  - Usage examples for complex APIs

- **Explanatory comments** for complex business logic or non-obvious implementations:
  - Why a particular approach was chosen
  - Edge cases being handled
  - Performance considerations
  - Workarounds for known issues (with ticket references)

#### Comments to AVOID

**DO NOT** write comments that:

- State the obvious (e.g., `// No observable subscriptions needed`)
- Describe what the code is doing when the code itself is self-explanatory
- Add no value beyond the code itself
- Are redundant with method/variable names
- Are placeholders or TODOs without context or ticket references

## Development Commands

```bash
# Start development server (runs on port 4100, not 4200)
npm start

# Build for production
npm run build

# Run tests
npm test

# Watch mode for development builds
npm run watch
```

Note: no `npm run lint` script is configured — `ng lint` requires installing a linter schematic if needed.

Commits and branches use the `TNK-XX` Jira ticket prefix (e.g. `TNK-67 …`). The pre-commit hook runs `pretty-quick --staged` to auto-format staged files.

## Project Architecture

This is an Angular 20 e-commerce application called "Tnakan" that integrates with Firebase for backend services.

### Tech Stack

- **Frontend**: Angular 20 with Angular Material, TailwindCSS, and SCSS
- **Backend**: NestJS REST API + WebSocket gateway at `../backend` (PostgreSQL via TypeORM, JWT auth, multer uploads). See `src/environments/environment*.ts` for the API base URL.
- **Hosting**: Firebase Hosting for the built SPA (GitHub Actions workflows in `.github/workflows/firebase-hosting-*.yml`)
- **Testing**: Karma + Jasmine
- **State Management**: RxJS observables + Angular signals
- **Internationalization**: ngx-translate with support for English, Armenian, and Russian
- **UI Components**: Angular Material, ngx-owl-carousel-o, animate.css

### Key Application Structure

The application follows a modular Angular architecture with these main areas:

#### User Types & Access Control

- **Customer**: Regular users who can browse and purchase products
- **Business**: Sellers who can manage products, orders, and advertisements
- **Admin**: System administrators who approve products and ads

Routes are protected using `AuthGuard` and `permissionsGuard(Type)` based on user type.

#### Core Features

- **Product Management**: Full CRUD for products with approval workflow
- **Order Management**: Order creation, tracking, and management for both customers and businesses
- **Authentication**: NestJS JWT auth (`POST /auth/login`, `POST /auth/register`, etc.) with email verification. JWT stored in `localStorage` under `tnakan_jwt`; attached to API calls by `src/app/shared/http/api.interceptor.ts`.
- **Shopping Cart**: Basket functionality with product availability tracking
- **Reviews & Ratings**: Product review system with average ratings
- **Advertisement System**: Business users can create ads that require admin approval

#### Service Architecture

- **ProductsService** (`src/app/shared/services/products.service.ts`): Handles all product operations including CRUD, approval, availability updates, and querying by various criteria
- **AuthService** (`src/app/shared/services/auth.service.ts`): NestJS-backed auth — login, register, logout, password reset, email verification. Exposes `currentUser` signal + `user$` observable.
- **TokenService** (`src/app/shared/services/token.service.ts`): Thin wrapper around `localStorage` for the JWT (`tnakan_jwt`).
- **UsersService**: User profile management against `/users/me`, `/users/:id`, `/users/businesses`.
- **BasketService**: Shopping cart functionality (client-side signal state)
- **OrderService**: Order processing and management via REST `/orders`
- **NotificationsSocketService** / **NotificationsService**: WebSocket (`socket.io-client`) connection to the backend's `/notifications` namespace + REST fallback for initial load.

#### Routing Structure

Routes are defined in `src/app/app.routes.ts`. Most are lazy-loaded standalone components. Customer/business/admin areas are gated by the local `authGuard` (`src/app/shared/guards/auth.guard.ts`) + `permissionsGuard(Type)`.

### Backend API

The frontend talks to a NestJS backend at `../backend` (sibling repo). Base URL lives in `src/environments/environment.ts` / `environment.development.ts` (`apiUrl`, `wsUrl`).

Surface:

- Auth: `/auth/login`, `/auth/register`, `/auth/verify-email`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/resend-verification`
- Users: `/users/me`, `/users/:id`, `/users/businesses`, `/users` (admin)
- Products: `/products`, `/products/top`, `/products/:id`, `/products/:id/approve`, `/products/:id/availability`, `/products/batch`
- Categories: `/categories`, `/categories/tree`, `/sub-categories`, `/product-categories`
- Orders: `/orders`, `/orders/customer`, `/orders/business`, `/orders/admin`, `/orders/:id/status`, `/orders/:id/products/:productId/status`
- Reviews: `/reviews`
- Uploads: `/uploads` (multipart; returns `{ url, filename, size }`)
- Notifications: `/notifications/my`, `/notifications/:id/status`; WebSocket namespace `/notifications` for `notification:new` / `notification:status` events

Auth header is added by `src/app/shared/http/api.interceptor.ts`. The interceptor only redirects to `/login` on 401 _if a token was present_ (so anonymous calls hitting auth-required endpoints don't bounce visitors off public pages).

### Development Notes

- The dev server runs on port 4100 (configured in package.json)
- Uses Angular standalone components with lazy loading for most routes
- Implements responsive design with TailwindCSS and Angular Material
- i18n: translations live in `public/assets/i18n/{en,am,ru}.json`, loaded via `TranslateHttpLoader` (ngx-translate)
- Uses Prettier and Husky for code formatting and git hooks
- Product availability can be set to "unlimited" or specific quantities
- The application includes an admin approval workflow for products and advertisements

### Testing

Run tests with `npm test` which uses Karma and Jasmine. The test configuration includes Angular Material theming and proper asset handling.

### Deployment

The built SPA is deployed to **Firebase Hosting**. Config lives in `firebase.json` (Hosting-only — no Firestore/RTDB sections) and `.firebaserc` (project `tnakan-23490`). CI/CD is driven by GitHub Actions:

- `.github/workflows/firebase-hosting-merge.yml` — deploys live on merges to `main` (uses secret `FIREBASE_SERVICE_ACCOUNT_TNAKAN_23490`)
- `.github/workflows/firebase-hosting-pull-request.yml` — deploys PR previews

For manual deploys, install the Firebase CLI and run `firebase deploy --only hosting` after `npm run build`. The backend API runs separately and is not deployed via this pipeline.

## AI / Angular Integrations

This repo follows Angular's recommendations for AI-assisted development (see [angular.dev/ai](https://angular.dev/ai/develop-with-ai)).

### Coding rules

When writing Angular/TypeScript code in this repo, follow [.github/copilot-instructions.md](.github/copilot-instructions.md) — verbatim from angular.dev's `best-practices.md`. Key points: signals over RxJS for local state, `input()`/`output()` functions over decorators, `inject()` over constructor injection, native control flow (`@if`/`@for`/`@switch`) over `*ngIf`/`*ngFor`, `OnPush` change detection, `NgOptimizedImage` for static images, no `ngClass`/`ngStyle` (use `class`/`style` bindings).

### Angular CLI MCP server

[.mcp.json](.mcp.json) registers two MCP servers for Claude Code (project-level config):

- **`angular-cli`** (`npx -y @angular/cli mcp`) — Angular CLI tools for codegen, workspace analysis, best-practices lookup, and docs search.
- **`playwright`** (`npx -y @playwright/mcp@latest`) — browser automation for AI-driven E2E / UI checks.

Run `npx -y @angular/cli mcp --help` for the authoritative tool list and flags (`--read-only`, `--local-only`). The exact tool set depends on the installed Angular CLI (currently 20.3.x).
