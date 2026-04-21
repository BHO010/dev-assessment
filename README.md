# Assignment

## Introduction

A REST API built with **Node.js**, **Express**, and **TypeScript**. It uses:

- **Zod** — request validation with descriptive error messages
- **Knex.js** — SQL query builder and database migrations
- **MySQL** — relational database
- **Swagger / OpenAPI** — auto-generated API documentation served at `/api-docs`
- **express-rate-limit** — rate limiting to prevent API abuse
- **Jest + Supertest** — unit testing

## Installation Guide

### Prerequisites

- Node.js v18+
- A running MySQL instance (local or remote)

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/BHO010/dev-assessment.git
   cd dev-assessment
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example env file and fill in your values:

   ```bash
   cp .env.example .env
   ```

   Update the following variables in `.env`:

   | Variable               | Description                                                    |
   | ---------------------- | -------------------------------------------------------------- |
   | `PORT`                 | Port the server listens on (default: `3000`)                   |
   | `DB_HOST`              | MySQL host (e.g. `localhost`)                                  |
   | `DB_PORT`              | MySQL port (default: `3306`)                                   |
   | `DB_USER`              | MySQL username                                                 |
   | `DB_PASSWORD`          | MySQL password                                                 |
   | `DB_NAME`              | MySQL database name                                            |
   | `CORS_OPTIONS`         | JSON string of CORS settings — update `origin` for production  |
   | `RATE_LIMIT_WINDOW_MS` | Rate limit window in milliseconds (default: `900000` = 15 min) |
   | `RATE_LIMIT_MAX`       | Max requests per window per IP (default: `100`)                |

4. **Run database migrations**

   This creates all required tables in your database:

   ```bash
   npm run migrate
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000`.  
   Swagger UI is available at `http://localhost:3000/api-docs`.

## Try it Live

> Hosted API coming soon.
>
> <!-- Replace the placeholder below with your deployed URL -->
>
> Base URL: `https://dev-assessment-chi.vercel.app`
>
> Swagger UI: `https://dev-assessment-chi.vercel.app/api-docs/`
