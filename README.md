# ✨ BrightIdeas ✨

Hey there! Welcome to BrightIdeas, a fullstack idea management app I built using a modern TypeScript stack.

[![Build Status](https://img.shields.io/github/actions/workflow/status/KaitenZx/BrightIdeas/fly-deploy.yml?branch=master&style=flat-square)](https://github.com/KaitenZx/BrightIdeas/actions/workflows/fly-deploy.yml) [![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square)](https://www.typescriptlang.org/) [![React](https://img.shields.io/badge/React-18-blue?style=flat-square)](https://reactjs.org/) [![Node.js](https://img.shields.io/badge/Node.js-22-green?style=flat-square)](https://nodejs.org/) [![tRPC](https://img.shields.io/badge/tRPC-10-orange?style=flat-square)](https://trpc.io/) [![Prisma](https://img.shields.io/badge/Prisma-6-purple?style=flat-square)](https://www.prisma.io/) [![Tested with](https://img.shields.io/badge/tested_with-Vitest-6D932B?style=flat-square)](https://vitest.dev/)

BrightIdeas is a full-stack idea management application, built to demonstrate the power and reliability of an end-to-end type-safe architecture with a modern TypeScript stack.

**➡️ Check it out live:** **[https://brightideas.fly.dev](https://brightideas.fly.dev)**

---

## 📸 Quick Look


![BrightIdeas - Create idea](https://github.com/user-attachments/assets/33e8f65f-11a8-40a0-adc3-401a1d8211d3)

![BrightIdeas - Update profile](https://github.com/user-attachments/assets/3bd43e66-dbd6-44db-be13-3cd27d203868)

![BrightIdeas - All ideas](https://github.com/user-attachments/assets/f97b3c4e-eac5-4384-8598-c187393e8986)

![BrightIdeas - View Idea](https://github.com/user-attachments/assets/d24bff6e-8ed9-475d-bba3-fcc495b38290)

![BrightIdeas - Sign in](https://github.com/user-attachments/assets/3eaa7564-807c-47db-a18b-14ead8e558e1)

**Core Features:**

- User accounts
- Create, view, update ideas
- Like ideas
- Search through ideas
- Basic admin action
- File uploads
- Email notifications
- Responsive design

---

## 🛠️ Tech Choices & Highlights

This project uses a **pnpm monorepo** structure (`backend`, `webapp`, `shared`). Here are some key tech decisions:

1.  **End-to-End Type Safety (TypeScript + tRPC + Prisma + Zod):**

    - Types flow seamlessly from the database (Prisma schema) through the backend API (tRPC router) to the React frontend.
    - Catches potential API inconsistencies during development, not in production. Big win for reliability!

2.  **Modern Stack:**

    - **Backend:** Node.js (ESM) with Express, Prisma (PostgreSQL ORM), Passport.js (JWT).
    - **Frontend:** React 18, Mantine UI, React Router, React Query.
    - **Shared Code:** The `/shared` package holds common types, Zod schemas, and utils, keeping things DRY.

3.  **Developer Experience & Quality:**

    - **Vite:** Super fast frontend development experience.
    - **Custom Hooks:** `useForm` and `withPageWrapper` on the frontend simplify form handling and page setup.
    - **Automation:** Husky + lint-staged enforce ESLint/Prettier rules before commits, keeping the codebase clean and consistent.

4.  **Production-Ready Practices:**
    - **CI/CD:** GitHub Actions automate testing, building, and deploying.
    - **Docker:** Multi-stage Dockerfile for optimized production images.
    - **Observability:** Sentry for error tracking (FE/BE), Winston for backend logging.
    - **Secure Config:** Zod validation for environment variables on startup. Secure passing of _public_ env vars to the frontend.
    - **Security Basics:** Rate limiting, input sanitization, secure file uploads via pre-signed URLs.

---

### Deeper Architectural Decisions & Patterns

> Beyond the specific technologies, this project showcases several key architectural patterns and best practices:
>
> - **Frontend Page Controller Pattern:** The `withPageWrapper` HOC acts as a declarative "engine" for pages. It handles data fetching, loading states, error handling, existence checks, and access control, leaving page components incredibly clean and focused purely on presentation.
> - **Data-Driven Navigation:** The main application layout is not hardcoded. Navigation links are generated from a centralized data structure, making the UI highly scalable and easy to maintain.
> - **Graceful Shutdown (Backend):** The server correctly handles `SIGTERM` and `SIGINT` signals to gracefully close database connections before exiting, a crucial practice for reliability in containerized environments like Docker.
> - **Accessibility (a11y) Focus:** Custom UI controls, like the gallery navigator, are built from the ground up with full accessibility in mind, supporting keyboard navigation and screen readers (`role`, `aria-label`, `onKeyDown`).
> - **Robust Component Design:** Complex components like the rich text editor are designed to be robust, with built-in protection against race conditions (e.g., preventing external state updates from overwriting active user input).

---

## 🚀 Run it Locally

**Need:** Node.js (v22), pnpm (v10+), Docker, Git.

1.  **Clone & Install:**
    ```bash
    git clone https://github.com/KaitenZx/BrightIdeas.git && cd BrightIdeas
    pnpm install
    ```
2.  **Set up .env Files:**
    - Copy `.example` files in `backend/`, `webapp/`, and the root (`env.docker.example`) to `.env` / `env.docker`.
    - Fill in **required** vars: `DATABASE_URL`, `JWT_SECRET`, `PASSWORD_SALT` (in `backend/.env` & `env.docker`). Others are needed for full features.
3.  **Start DB & Migrate:**

    ```bash
    docker compose up -d db # Uses env.docker
    pnpm b pmd             # Runs 'prisma migrate dev'
    ```

4.  **Run Dev Servers:**
    ```bash
    pnpm dev
    ```
    - Backend: `http://localhost:3000`
    - Frontend: `http://localhost:8000`

---

## 🧪 Testing

- `pnpm test`: Run tests (mainly backend integration for now). Requires test DB setup (`backend/.env.test`, `pnpm b pmt`).

---

## 👋 Connect

Yura Shakhov

- LinkedIn: [https://www.linkedin.com/in/yura-sh](https://www.linkedin.com/in/yura-sh)
- GitHub: [https://github.com/KaitenZx](https://github.com/KaitenZx)
