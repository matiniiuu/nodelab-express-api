# Project Title

Multi-API Workspace

## Overview

This repository contains a project designed to efficiently separate and manage multiple APIs—such as admin, mobile, and web—within a single monorepo. It leverages MongoDB, Redis, RabbitMQ, and NestJS cron jobs to provide a scalable, maintainable architecture suited for enterprise applications.

## Features

-   **Data Persistence:** MongoDB integration for flexible document storage.
-   **Caching & Sessions:** Redis for caching and session management.
-   **Messaging:** RabbitMQ for event-driven communication.
-   **Scheduled Tasks:** Built-in cron jobs via `node-cron`.
-   **Swagger/OpenAPI:** Auto-generated API documentation with environment-protected access.

## Prerequisites

-   Node.js (>=20.x)
-   Yarn (>=1.22.x)
-   Docker & Docker Compose (optional)
-   MongoDB
-   Redis
-   RabbitMQ

## Installation

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2.  **Install dependencies**

    ```bash
    yarn install
    ```

3.  **Environment Variables** Create a `.env` file at the root of the workspace and configure the following variables:

        ```dotenv
        PORT=8000

        NODE_ENV="development"
        LOGGER_LEVEL="silly"

        # MongoDB
        MONGODB_DB_URL=""
        MONGODB_DB_NAME=""

        # Auth
        JWT_ACCESS_SECRET=""
        JWT_ACCESS_EXPIRATION_TIME="1h"
        JWT_REFRESH_SECRET=""
        JWT_REFRESH_EXPIRATION_TIME="30d"

        # Swagger
        SWAGGER_USERNAME=""
        SWAGGER_PASSWORD=""

        # Redis
        REDIS_URL=""
        REDIS_PASSWORD=""

        # RabbitMQ
        RABBITMQ_URI=""

        # Sentry
        SENTRY_DSN=""

    ```

    ```

## Running the APIs

### API

-   **Start in development mode**
    ```bash
    yarn dev
    ```
-   **Default port:** `8000`
-   **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs.json) (use credentials from `.env`)

## Project Structure

## Database

-   **MongoDB**
    -   Connection via Mongoose module.
    -   Schemas defined in each app or shared library.

## Caching & Sessions

-   **Redis**
    -   Configured as a cache store and session store.

## Messaging

-   **RabbitMQ**
    -   Event-based communication between services.
    -   Consumers and publishers configured via `@nestjs/microservices`.

## Cron Jobs

-   Scheduled tasks implemented using `@nestjs/schedule`.
-   Add cron methods in dedicated services under each app.

## Swagger Documentation

-   Enabled in both Admin and Core APIs.
-   Protect your docs using basic auth; credentials stored in environment variables.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
