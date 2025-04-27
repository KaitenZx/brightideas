# ✨ BrightIdeas: A Modern Fullstack TypeScript Showcase ✨

**From Database to UI: Building a Production-Ready Idea Management Platform with End-to-End Type Safety.**

[![Build Status](https://img.shields.io/github/actions/workflow/status/KaitenZx/BrightIdeas/fly-deploy.yml?branch=master&style=flat-square)](https://github.com/KaitenZx/BrightIdeas/actions/workflows/fly-deploy.yml) [![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square)](https://www.typescriptlang.org/) [![React](https://img.shields.io/badge/React-18-blue?style=flat-square)](https://reactjs.org/) [![Node.js](https://img.shields.io/badge/Node.js-22-green?style=flat-square)](https://nodejs.org/) [![tRPC](https://img.shields.io/badge/tRPC-10-orange?style=flat-square)](https://trpc.io/) [![Prisma](https://img.shields.io/badge/Prisma-6-purple?style=flat-square)](https://www.prisma.io/) [![Tested with](https://img.shields.io/badge/tested_with-Vitest-6D932B?style=flat-square)](https://vitest.dev/) [![Docker](https://img.shields.io/badge/Docker-ready-blue?style=flat-square&logo=docker)](https://www.docker.com/) [![Code Style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io)

---

## 🚀 The Vision: More Than Just a Demo

BrightIdeas isn't just another portfolio project; it's a testament to building **robust, modern, and maintainable fullstack applications** using the best of the TypeScript ecosystem. It was conceived to demonstrate a mastery of backend development, seamless API integration, robust deployment pipelines, and an unwavering commitment to code quality and best practices – all while delivering a functional platform for nurturing creativity.

**The core philosophy?** Leverage cutting-edge tools to achieve **end-to-end type safety**, streamline development workflows, and build an application that's as enjoyable to develop as it is to use.

**➡️ Try the Live Application:** **[https://brightideas.fly.dev](https://brightideas.fly.dev)**
_(Feel free to sign up for a new account to explore!)_

---

## 📸 Feature Glimpse

_[ **IMPORTANT:** Replace this section with actual screenshots or GIFs! Visually demonstrating the UI/UX is crucial. Show off the idea feed, creation form, profile page, search results, etc. ]_

- **User Authentication:** Secure sign-up, sign-in (JWT), profile & password management.
- **Idea Lifecycle:** Create, read, update, and manage your brilliant ideas.
- **Engagement:** Like ideas to show appreciation.
- **Discovery:** Powerful text search (powered by PostgreSQL Full-Text Search via Prisma).
- **Admin Capabilities:** Basic role system (`UserPermission`) for actions like blocking inappropriate ideas.
- **Rich Content:** Upload images (Cloudinary) and documents (AWS S3) directly and securely from the client using pre-signed URLs.
- **Stay Informed:** Automated email notifications (built with MJML) for key events and weekly digests.
- **Responsive UI:** Looks great on desktop and mobile.

---

## ✨ Why BrightIdeas Stands Out: Technical Highlights & Philosophy

This project isn't just about the features; it's about _how_ they were built. Here's what makes it a strong demonstration of professional development practices:

1.  **🛡️ End-to-End Type Safety: The Holy Grail**

    - Leveraging **TypeScript** across the entire stack (frontend, backend, shared code) combined with **tRPC** and **Prisma**.
    - **Benefit:** Eliminates entire classes of runtime errors. Changes in the database schema (Prisma) or backend API (tRPC) are instantly reflected as TypeScript errors in the frontend _during development_, not in production. No manual type synchronization, no REST/GraphQL schema drift.

2.  **🏗️ Modern Monorepo Architecture (PNPM Workspaces)**

    - Organized into `backend`, `webapp`, and a crucial `shared` package.
    - **Benefit:** Simplifies dependency management (`pnpm`), promotes code reuse (especially types, Zod schemas, utils in `shared`), and ensures consistency across the application.

3.  **🚀 Blazing Fast Development & Build (Vite)**

    - Utilizing **Vite** for the frontend provides near-instant Hot Module Replacement (HMR) during development and optimized builds for production.

4.  **🔒 Robust Backend Foundation (Node.js, Express, Prisma)**

    - Built on modern **Node.js (ESM)** with **Express.js** for routing and middleware.
    - **Prisma** provides a type-safe database client, declarative schema management, and smooth migrations for **PostgreSQL**.
    - Includes essential security features like rate limiting (`express-rate-limit`) and input sanitization (`sanitize-html`).

5.  **🧩 Elegant Frontend Experience (React, Mantine, Custom Hooks)**

    - **React 18** with a well-structured component system.
    - **Mantine UI** library provides a solid base, customized with a dedicated theme (`App.tsx`).
    - **Custom Hooks & Abstractions** like `useForm` (integrating Formik, Zod, and submission logic) and `withPageWrapper` (handling loading, errors, auth checks, titles) significantly reduce boilerplate and improve code clarity.
    - **Performance:** Code splitting (`React.lazy`, `Suspense`) ensures faster initial loads.

6.  **☁️ Scalable File Handling (AWS S3 & Cloudinary)**

    - Implements secure, direct client-side uploads using **pre-signed URLs** for both AWS S3 (documents) and Cloudinary (images), minimizing backend load.

7.  **⚙️ Automated Quality & Consistency (ESLint, Prettier, Husky)**

    - **Strict ESLint rules** (using flat config) enforce code style, prevent potential errors, and maintain architectural integrity (e.g., preventing direct backend imports in frontend).
    - **Prettier** ensures consistent formatting across the codebase.
    - **Husky + lint-staged** automatically lint and format code _before_ each commit, guaranteeing quality gates are met.

8.  **🚢 Seamless CI/CD & Deployment (Docker, GitHub Actions, Fly.io)**

    - **Optimized Multi-Stage Dockerfile:** Creates lean, production-ready container images. Securely handles build secrets (`SENTRY_AUTH_TOKEN`).
    - **GitHub Actions:** Automates linting, testing, building, and **deployment to Fly.io** on every push to `master`. Includes source map uploads to Sentry.
    - **Fly.io Configuration (`fly.toml`):** Manages deployment settings, including running database migrations automatically on release.

9.  **📊 Production-Ready Observability (Sentry, Winston, Mixpanel)**

    - **Sentry:** Integrated on both frontend and backend for real-time error tracking with source maps for easy debugging.
    - **Winston:** Structured logging on the backend, configured for different environments.
    - **Mixpanel:** Basic frontend analytics integration.

10. **🔒 Secure Environment Management (dotenv, Zod)**
    - Uses `.env` files for configuration, validated rigorously at startup using **Zod** schemas to prevent runtime errors due to missing or invalid variables.
    - A secure mechanism passes _only necessary, public_ variables from the backend to the frontend in production builds.

---

## 🛠️ Tech Stack Deep Dive

- **Core:** TypeScript (Strict), Node.js (v22, ESM), React (v18)
- **API:** tRPC (v10)
- **Database:** PostgreSQL, Prisma (v6 ORM)
- **Frontend:**
  - Bundler: Vite
  - UI: Mantine UI (Custom Theme), SCSS Modules
  - Routing: React Router v6
  - State/Cache: TanStack Query (React Query v4), React Context, Nano Stores
  - Forms: Formik, Zod (`formik-validator-zod`)
- **Backend:** Express.js, Passport.js (JWT Auth)
- **File Storage:** AWS S3 SDK v3, Cloudinary SDK
- **Emails:** MJML
- **Testing:** Vitest (Unit & Integration)
- **DevOps:** Docker, Docker Compose, PNPM Workspaces, GitHub Actions, Fly.io
- **Quality:** ESLint (Flat Config), Prettier, Stylelint, Husky, lint-staged
- **Observability:** Sentry, Winston, Mixpanel
- **Utilities:** Lodash, date-fns, SuperJSON, Zod

---

## 🚀 Getting Started Locally

### Prerequisites

- Node.js (v22 - check `.nvmrc` or `package.json` engines)
- PNPM (v10+ - check `package.json`)
- Docker & Docker Compose
- Git

### Steps

1.  **Clone:** `git clone https://github.com/KaitenZx/BrightIdeas.git && cd BrightIdeas`
2.  **Install:** `pnpm install`
3.  **Configure Environment:**
    - `cp backend/env.example backend/.env`
    - `cp webapp/env.example webapp/.env`
    - `cp env.docker.example env.docker` (for Docker Compose)
    - **Crucially, fill in `DATABASE_URL`, `JWT_SECRET`, and `PASSWORD_SALT` in `backend/.env` and `env.docker`.** Other keys (S3, Cloudinary, Sentry, etc.) are needed for full functionality but might be optional for basic local runs (check Zod schemas in `lib/env.ts`).
4.  **Start Database:** `docker compose up -d db` (uses `env.docker` for port/credentials)
5.  **Apply Migrations:** `pnpm b pmd` (This runs `prisma migrate dev` inside the backend)
6.  **Run Dev Servers:** `pnpm dev`
    - Backend API: `http://localhost:3000` (or port from `backend/.env`)
    - Frontend App: `http://localhost:8000` (or port from `webapp/.env`)

---

## 🧪 Testing

- **Linting:** `pnpm lint` (Runs ESLint/Stylelint across all packages)
- **Run All Tests:**
  - Ensure the test database is configured (`backend/.env.test`) and migrated (`pnpm b pmt`).
  - `pnpm test`
- **Run Backend Tests:** `pnpm b test`
- **Run Frontend Tests:** `pnpm w test` (if applicable)

---

## 🚢 Deployment Pipeline

- **Platform:** Fly.io
- **Trigger:** Push to `master` branch.
- **Process:** Defined in `.github/workflows/fly-deploy.yml`. Builds the Docker image (using `Dockerfile` and `fly.toml`), pushes it, and releases it on Fly.io, automatically running Prisma migrations (`release_command` in `fly.toml`).
- **Secrets:** Requires various API keys and secrets set in Fly.io secrets (see `env.example` and `fly.toml` for hints).

---

## ⚙️ Environment Variable Handling

- Configuration loaded via `.env` files (`dotenv-cli`).
- **Strict validation** using Zod schemas on application startup (`backend/src/lib/env.ts`, `webapp/src/lib/env.ts`).
- Frontend receives necessary public variables securely injected by the backend during server-side rendering in production (`backend/src/lib/serveWebApp.ts`).

---

## 🔮 Future Enhancements & Learning Opportunities

- **Expand Test Coverage:** Implement comprehensive frontend component tests (React Testing Library/Vitest) and increase backend unit test coverage.
- **Real-time Features:** Add WebSocket integration for instant updates (e.g., new likes, comments).
- **Advanced Search:** Integrate a dedicated search engine like MeiliSearch or Elasticsearch.
- **Feature Growth:** Implement commenting, idea tagging/categorization, more granular user roles.
- **Performance Tuning:** Deeper analysis of frontend bundle size (using `rollup-plugin-visualizer`) and database query optimization.

---

## 👋 Let's Connect!

Yura Shakhov

- LinkedIn: [https://www.linkedin.com/in/yura-sh](https://www.linkedin.com/in/yura-sh)
- GitHub: [https://github.com/KaitenZx](https://github.com/KaitenZx)
