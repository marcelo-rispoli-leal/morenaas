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
npm start       # production mode
```

## API Documentation

Access interactive documentation using Swagger UI at https://morenaas.alwaysdata.net/docs after starting the server.

## Database Configuration

The included PostgreSQL user in `.env` has all privileges to the unique database created in the instance.

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

## Deploy to AlwaysData (Optional)

This project is configured for continuous deployment to [AlwaysData](https://www.alwaysdata.com/) using GitHub Actions.

### Prerequisites

1.  An AlwaysData account.
2.  A Node.js site configured in your AlwaysData account.
3.  An AlwaysData API token.

### Configuration

1.  **Fork this repository** to your GitHub account.

2.  **Configure GitHub Secrets:**
    In your GitHub repository, go to `Settings` > `Secrets and variables` > `Actions` and add the following secrets:

    - `AWD_GIT_BRANCH`: The name of the GitHub branch to deploy to AlwaysData after push (e.g., `master`).
    - `AWD_SSH_HOST`: Your SSH server address on AlwaysData (e.g., `ssh-yoursite.alwaysdata.net`).
    - `AWD_SSH_USER`: Your SSH username on AlwaysData (e.g., `yoursite`).
    - `AWD_SSH_PASSWORD`: Your SSH user password on AlwaysData (or an app password).
    - `AWD_SSH_PORT`: Your SSH port on AlwaysData (e.g., `22`).
    - `AWD_SITE_PATH`: Your site path on AlwaysData (e.g., `www/yoursite`).
    - `AWD_API_KEY`: Your AlwaysData API token. When generating the token, type `site` in the `Application` field.
    - `AWD_ACCOUNT`: Your account on AlwaysData (e.g `yoursite`).
    - `AWD_SITE_ID`: Your site ID on AlwaysData. You can find the ID in the URL when editing your site in the AlwaysData panel (e.g., `https://admin.alwaysdata.com/site/123456/`, the ID is `123456`).

3.  **Deploy:**
    Any `push` to the `AWD_GIT_BRANCH` branch will trigger the GitHub Actions workflow, which will deploy your application to the AlwaysData server and restart it automatically.
