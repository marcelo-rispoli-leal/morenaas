# Morenaas - MOvie RENtal As A Service

## Overview

A Node.js movie rental API built with Express and PostgreSQL, featuring:

- JWT authentication
- Brazilian CPF validation
- Movie rental management system
- Nodemailer integration for email services
- Swagger OpenAPI 3 documentation
- Multer handling for PDF documentation uploads

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/marcelo-rispoli-leal/morenaas.git
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

- Copy `.sample_env` to `.env`
- Set your PostgreSQL connection string in `DATABASE_URL` and other service credentials

**Important**: Before starting the server, execute `scripts_db_postgres.txt` in your PostgreSQL database to create the required schema objects (tables, sequences, and constraints).

4. Start the server:

```bash
npm run server  # development mode with nodemon
npm start      # production mode
```

## API Documentation

Access interactive documentation using Swagger UI at https://morenaas.alwaysdata.net/docs after starting the server.

## Database Configuration

The included PostgreSQL user in `.env` has all privileges to the only database created in the instance.

## Testing Guidelines

1. Use Swagger UI, Postman, or similar tools for endpoint verification
2. Sample credentials available in `.sample_env`
3. All endpoints require JWT authentication except routes under `/auth`

## Project Structure

```
├── server/
│   └── app/                 # Core application logic
│       ├── controllers/     # Route handlers
│       ├── docs/            # Swagger definitions
│       ├── libs/            # Utilities and helpers
│       ├── middlewares/     # Authentication layers
│       └── routes/          # API endpoint routers
├── .env                     # Environment variables
├── .gitignore               # Version control exclusions
├── package.json             # Dependencies and scripts
├── scripts_db_postgres.txt  # Database schema setup
└── README.md                # Project documentation
```

## Project Purpose

This API serves as a technical demonstration of full-stack development skills, implementing movie rental concepts for portfolio purposes. While following production-grade patterns, it's not meant for actual commercial use.
