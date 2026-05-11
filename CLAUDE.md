# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Claude Code Workflow Guidelines

### Collaboration Rules (HARD CONSTRAINTS)

These rules are absolute and override any conflicting instruction in skills, slash commands, or templates:

1. **Never post comments on PRs or MRs.** Do not run `gh pr comment`, `gh pr review`, `glab mr note`, or any other command that writes to a pull/merge request. This applies to *all* automated output — code-review summaries, "no issues found" templates, reaction footers, status updates, suggestions, anything. When a skill (e.g. `/code-review`) prescribes posting back to a PR/MR, run the review locally and report findings to the user in chat. Skip the post step.

2. **Never mention Claude / Claude Code / AI assistance anywhere.** This includes commit messages, PR/MR descriptions, code comments, generated docs, README updates, JSDoc, and any other artifact that lives in the repo or in shared tooling. Strip the "🤖 Generated with Claude Code" footer (and any equivalent) from any template before use. No `Co-Authored-By: Claude` trailers on commits.

### Behavioral Guidelines

Behavioral guidelines to reduce common LLM coding mistakes. These bias toward caution over speed — for trivial tasks, use judgment.

#### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

#### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

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

This is an Angular 19 e-commerce application called "Tnakan" that integrates with Firebase for backend services.

### Tech Stack

- **Frontend**: Angular 19 with Angular Material, TailwindCSS, and SCSS
- **Backend**: Firebase (Firestore, Authentication, Storage, Analytics)
- **Testing**: Karma + Jasmine
- **State Management**: RxJS observables with services
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
- **Authentication**: Firebase Auth with email verification
- **Shopping Cart**: Basket functionality with product availability tracking
- **Reviews & Ratings**: Product review system with average ratings
- **Advertisement System**: Business users can create ads that require admin approval

#### Service Architecture

- **ProductsService** (`src/app/shared/services/products.service.ts`): Handles all product operations including CRUD, approval, availability updates, and querying by various criteria
- **FirebaseAuthService** (`src/app/shared/services/firebase-auth.service.ts`): Manages authentication, registration, login/logout
- **UsersService**: User profile management and data persistence
- **BasketService**: Shopping cart functionality
- **OrderService**: Order processing and management

#### Routing Structure

Routes are defined in `src/app/app.routes.ts`. Most are lazy-loaded standalone components. Customer/business/admin areas are gated by `AuthGuard` + `permissionsGuard(Type)`.

### Firebase Configuration

The application uses multiple Firebase services:

- **Firestore**: Product, user, and order data
- **Authentication**: User management with email verification
- **Storage**: Image uploads for products and user profiles
- **Analytics**: Usage tracking
- **Realtime Database**: Additional real-time features

Firebase config is in `src/app/app.config.ts` with project ID `tnakan-23490`.

Note: providers come from `@angular/fire` (v19), but service-layer code uses the Firebase JS SDK directly (migrated in TNK-67). When writing new service code, prefer Firebase JS SDK imports over AngularFire wrappers.

The `firestore.rules` in the repo currently denies all access — production rules are managed separately and deployed independently. Don't rely on the repo file as the source of truth for prod security rules.

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

The application is configured for Firebase Hosting deployment. Use `firebase deploy` after building the project.

## AI / Angular Integrations

This repo follows Angular's recommendations for AI-assisted development (see [angular.dev/ai](https://angular.dev/ai/develop-with-ai)).

### Coding rules

When writing Angular/TypeScript code in this repo, follow [.github/copilot-instructions.md](.github/copilot-instructions.md) — verbatim from angular.dev's `best-practices.md`. Key points: signals over RxJS for local state, `input()`/`output()` functions over decorators, `inject()` over constructor injection, native control flow (`@if`/`@for`/`@switch`) over `*ngIf`/`*ngFor`, `OnPush` change detection, `NgOptimizedImage` for static images, no `ngClass`/`ngStyle` (use `class`/`style` bindings).

Note: this project is on Angular 19, so the "do NOT set `standalone: true`" rule (which targets v20+ where it's default) applies here too — standalone is already the default in v19.

### Angular CLI MCP server

The Angular CLI MCP server is configured in two places:

- [.mcp.json](.mcp.json) — picked up by Claude Code (project-level MCP config)
- [.vscode/mcp.json](.vscode/mcp.json) — picked up by VS Code's native MCP support

It exposes tools like `find_examples`, `get_best_practices`, `search_documentation`, `list_projects`, and `onpush_zoneless_migration`. Run `npx -y @angular/cli mcp --help` for the full list. Experimental tools (`build`, `test`, `e2e`, `devserver.*`, `modernize`) need the `-E <tool>` flag and Angular CLI v20+ for full functionality — this project is on v19 so some experimental tools may not be available until the CLI is upgraded.

### Angular Agent Skills (not installed)

Angular publishes agent skills at [github.com/angular/skills](https://github.com/angular/skills) (`angular-developer`, `angular-new-app`), installable via `npx skills add https://github.com/angular/skills`. That command targets the [skills.sh](https://skills.sh) framework (Gemini CLI / Antigravity), not Claude Code's plugin/skill system. Install manually if you also use those tools.
