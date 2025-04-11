# BrightIdeas ✨ - Fullstack Idea Management Platform

**Short description:** A modern fullstack web application built from the ground up to showcase the transition from frontend specialization to fullstack development. This project features end-to-end type safety with TypeScript, React, Node.js, tRPC, Prisma, PostgreSQL, along with best practices in CI/CD, logging, monitoring, and code quality automation.

[![Build Status](https://img.shields.io/github/actions/workflow/status/KaitenZx/BrightIdeas/fly-deploy.yml?branch=main&style=flat-square)](https://github.com/KaitenZx/BrightIdeas/actions/workflows/fly-deploy.yml) [![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square)](https://www.typescriptlang.org/) [![React](https://img.shields.io/badge/React-18-blue?style=flat-square)](https://reactjs.org/) [![Node.js](https://img.shields.io/badge/Node.js-22-green?style=flat-square)](https://nodejs.org/) [![tRPC](https://img.shields.io/badge/tRPC-10-orange?style=flat-square)](https://trpc.io/) [![Prisma](https://img.shields.io/badge/Prisma-6-purple?style=flat-square)](https://www.prisma.io/) [![Code Style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io) [![Tested with](https://img.shields.io/badge/tested_with-Vitest-6D932B?style=flat-square)](https://vitest.dev/) [![Docker](https://img.shields.io/badge/Docker-ready-blue?style=flat-square&logo=docker)](https://www.docker.com/)

---

## 🚀 Live Demo

**Try the application live:** **https://brightideas.fly.dev**

*(Remember to provide test credentials if needed for login, or describe the sign-up process)*

---

## 📸 Screenshots

*[FILL ME IN: Add several screenshots or GIFs here demonstrating key screens and features of the application.]*

---

## 🎯 Project Goal

This project was created with a dual purpose:

1.  **Build a useful tool:** Develop a functional platform for managing ideas.
2.  **Demonstrate Fullstack Skills:** Showcase my ability to design, develop, test, and deploy fullstack applications by mastering backend technologies, database interactions, API creation, CI/CD, logging, monitoring, and applying modern approaches and tools across the entire stack.

---

## ✨ Key Features

*   **User Authentication:** Sign up, sign in (JWT), sign out, profile/password updates.
*   **Idea Management:** CRUD operations for ideas.
*   **Like System:** Users can like ideas they find interesting.
*   **Search & Filtering:** Text-based search capabilities for ideas (utilizing PostgreSQL Full-Text Search via Prisma).
*   **Role-Based Access Control (RBAC):** Basic permission system (`UserPermission`) allowing administrators specific actions (e.g., blocking ideas).
*   **File Uploads:** Integration with Cloudinary for images and AWS S3 for documents, using pre-signed URLs for secure client-side uploads.
*   **Email Notifications:** Sending formatted HTML emails (MJML templates) for registration, idea blocking, and weekly digests of top ideas.
*   **Background Jobs:** Using Cron (`node-cron`) for periodic tasks (sending digests).
*   **Full Type Safety:** End-to-end type safety from the database to the UI, thanks to TypeScript and tRPC.
*   **Responsive Design:** The interface displays correctly on various devices.

---

## 🛠️ Tech Stack & Tooling

The project is implemented as a **monorepo** using `pnpm workspaces`.

### Frontend (`/webapp`)

*   **Language:** TypeScript (Strict)
*   **Framework/Library:** React 18
*   **Bundler & Dev Server:** Vite
*   **Routing:** React Router v6
*   **API Client:** tRPC Client (v10) with TanStack Query (React Query v4) integration
*   **State Management:** React Context API, TanStack Query (for server state)
*   **Forms:** Formik + `formik-validator-zod` (Zod integration for validation)
*   **Styling:** SCSS (CSS Modules), `normalize.css`, `include-media` (responsiveness)
*   **UI:** Custom React component library, React Icons
*   **Utilities:** Lodash, date-fns, classnames, usehooks-ts, SuperJSON
*   **Testing:** Vitest (configured for `jsdom`)
*   **Analytics:** Mixpanel
*   **Error Monitoring:** Sentry (with source map integration)

### Backend (`/backend`)

*   **Language:** TypeScript (Strict)
*   **Runtime:** Node.js 22
*   **Framework:** Express.js
*   **API:** tRPC (v10)
*   **Database:** PostgreSQL
*   **ORM:** Prisma (v6) (with migrations and client generation)
*   **Authentication:** Passport.js (JWT strategy)
*   **File Uploads:** AWS SDK v3 (S3), Cloudinary SDK
*   **Email:** MJML (templating), (SMTP service like Brevo/SendGrid assumed)
*   **Background Jobs:** `node-cron`
*   **Logging:** Winston (JSON format for prod, colored for local, data masking)
*   **Monitoring:** Datadog (log shipping), Sentry (error tracking)
*   **Validation:** Zod (for env variables and tRPC inputs)
*   **Testing:** Vitest (Unit & Integration tests)
*   **Utilities:** date-fns, Lodash, SuperJSON, `serialize-error`

### Shared (`/shared`)

*   **Language:** TypeScript (Strict)
*   **Purpose:** Common types (including inferred tRPC types), Zod schemas, utilities (pick, omit), constants (routes), `parsePublicEnv` for securely passing variables to the frontend.

### DevOps & Quality Tools

*   **Package Manager:** PNPM (with Workspaces)
*   **Containerization:** Docker, Docker Compose (for DB and builds)
*   **CI/CD:** GitHub Actions
*   **Hosting:** Fly.io
*   **Code Quality:**
    *   ESLint (Flat config, strict rules for TS, React, Node, Imports, Vitest, A11y, custom architectural rules)
    *   Prettier (auto-formatting)
    *   Stylelint (for SCSS)
*   **Git Hooks:** Husky + lint-staged (auto-checking and formatting before commit)
*   **Environment Management:** `.env` files, `dotenv-cli`, Zod validation

---

## 🏛️ Architectural Decisions & Technical Highlights

*   **Monorepo (PNPM Workspaces):** Optimizes dependency management, ensures version consistency, and simplifies code reuse (`shared` package) and tooling setup.
*   **End-to-End Type Safety (TypeScript + tRPC):** A key advantage. Guarantees type consistency between backend, API, and frontend without code generation, significantly improving reliability and development speed.
*   **Prisma ORM:** A modern approach to database interaction in TypeScript. Provides type-safe queries, a simple migration system, and automatic type generation.
*   **Clean Backend Architecture:** API logic is separated by feature (`router`), infrastructure modules are isolated in `lib`, ensuring good Separation of Concerns (SoC). The router structure (`router/feature/action/index.ts` + `input.ts`) promotes scalability.
*   **Production-Ready Logging & Monitoring:** Configured Winston with sensitive data masking and structured log shipping to Datadog (for production). Sentry integration on both backend and frontend with source maps for efficient error debugging.
*   **Secure & Flexible Environment Management:** Use of `.env` files for different environments, strict Zod validation of variables at application startup. Implemented a secure mechanism to pass *only necessary* variables from backend to frontend (`window.webappEnvFromBackend`) without baking them into the bundle.
*   **Reliable File Uploads:** Support for two services (Cloudinary, AWS S3) using pre-signed URLs for secure direct-from-client uploads.
*   **Automated CI/CD:** Configured GitHub Actions workflow for building, testing (linting), and automatically deploying to Fly.io on pushes to `main`. Includes sending source maps to Sentry.
*   **High Code Quality & Automation:** Strict ESLint rules (including custom ones to enforce architecture, e.g., disallowing direct imports from `backend` to `webapp`), Prettier, Stylelint. Automatic rule enforcement via Git Hooks (Husky + lint-staged).
*   **Thoughtful Docker Build:** Multi-stage `Dockerfile` optimizes the final image size, utilizing build secrets and `pnpm` caching.
*   **Modern Frontend:** Uses Vite for fast development, React 18, code-splitting (`React.lazy`, `Suspense`) for load optimization, and SCSS Modules for style isolation.
*   **Testing Foundation:** Testing infrastructure based on Vitest, presence of backend integration tests with helper functions for data setup.
*   **Email Templating (MJML):** Using MJML allows for creating responsive and appealing HTML emails effortlessly.

---

## 🚀 How to Run Locally

### Prerequisites

*   Node.js (v22+, see `package.json` engines)
*   PNPM (v10+, see `package.json`)
*   Docker & Docker Compose
*   Git

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/BrightIdeas.git
    cd BrightIdeas
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Configure environment variables:**
    *   Copy `backend/env.example` to `backend/.env`.
    *   Copy `webapp/env.example` to `webapp/.env`.
    *   Carefully fill in the **mandatory** variables (`DATABASE_URL`, `JWT_SECRET`, `PASSWORD_SALT`).
    *   For full functionality, fill in API keys for Cloudinary, S3, Sentry, Datadog, Email. Locally, some can be left empty if their services are not critical for testing (check `zEnvNonemptyTrimmedRequiredOnNotLocal` in `backend/src/lib/env.ts`).

4.  **Start the PostgreSQL database:**
    ```bash
    docker compose up -d db
    ```

5.  **Apply Prisma migrations:**
    ```bash
    pnpm b pmd # Runs 'prisma migrate dev' in the backend workspace
    ```

6.  **Run both applications in development mode:**
    ```bash
    pnpm dev
    ```
    *   Backend: `http://localhost:3000` (or port from `backend/.env`)
    *   Frontend: `http://localhost:8000` (or port from `webapp/.env`)

### Running Tests

*   **Run all lint checks:**
    ```bash
    pnpm lint
    ```
*   **Run all tests (currently backend integration):**
    *   Ensure the test database (`DATABASE_URL` in `backend/.env.test`) is available and migrations are applied (`pnpm b pmt`).
    ```bash
    pnpm test
    ```
*   **Run backend tests only:**
    ```bash
    pnpm b test
    ```
*   **Run webapp tests only (if available):**
    ```bash
    pnpm w test
    ```

---

## 🚢 Deployment

The application is configured for automatic deployment to [Fly.io](https://fly.io/) via GitHub Actions.

*   **Configuration:** `fly.toml` (including `release_command` for Prisma migrations).
*   **Dockerfile:** Optimized multi-stage Dockerfile in the root directory.
*   **CI/CD Workflow:** `.github/workflows/fly-deploy.yml`.
*   **Required Fly.io Secrets (`fly secrets set NAME=VALUE`):**
    *   `DATABASE_URL` (production DB)
    *   `JWT_SECRET`, `PASSWORD_SALT`, `INITIAL_ADMIN_PASSWORD`
    *   `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_CLOUD_NAME`
    *   `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME`, `S3_REGION`, `S3_URL`
    *   `BACKEND_SENTRY_DSN`, `VITE_WEBAPP_SENTRY_DSN`
    *   `VITE_MIXPANEL_API_KEY`
    *   `DATADOG_API_KEY`
    *   Optionally: `BREVO_API_KEY`, `FROM_EMAIL_NAME`, `FROM_EMAIL_ADDRESS`

---

## ⚙️ Environment Variables

See the `env.example` files in the `backend` and `webapp` directories for a comprehensive list of required variables. Variables are validated on application startup using Zod.

---


## 🔮 Potential Improvements & Areas for Growth

*   **Testing:** **Significantly increase test coverage**, especially for Frontend components and pages (using React Testing Library / Vitest). Add more unit tests for utilities in `backend` and `shared`.
*   **Features:**
    *   Add comments to ideas.
    *   Implement WebSockets (e.g., via `ws` or Socket.IO) for real-time updates.
    *   Enhance search capabilities (integrate with ElasticSearch/MeiliSearch).
    *   Add a tagging/category system for ideas.
    *   Expand the role model (editors, moderators).
*   **Optimization:** Analyze frontend bundle performance (`rollup-plugin-visualizer` is already set up). Optimize database queries if necessary.

---


## 👋 Contact

Yura Shakhov, https://www.linkedin.com/in/yura-sh

---
