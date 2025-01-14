# Document Management System Backend

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Table of Contents

- [Description](#description)
- [Architecture](#architecture)
- [Modules](#modules)
- [API Endpoints](#api-endpoints)
- [Third-Party Integrations](#third-party-integrations)
- [Microservices and Ingestion Process](#microservices-and-ingestion-process)
- [Docker and RabbitMQ](#docker-and-rabbitmq)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Support](#support)
- [Stay in Touch](#stay-in-touch)
- [License](#license)

## Description

This project is a backend system for managing documents, built using the NestJS framework. It provides APIs for document creation, retrieval, updating, and deletion, as well as an ingestion process to handle document processing with a Python backend.

## Architecture

The application is structured using the NestJS framework, which follows a modular architecture. It consists of several modules, each responsible for a specific domain of the application. The application also integrates with a Python backend for document ingestion processes.

## Modules

### Auth Module

- **Purpose**: Handles authentication and authorization using JWT.
- **Key Components**: `AuthService`, `JwtStrategy`, `AuthController`.

### Users Module

- **Purpose**: Manages user data and roles.
- **Key Components**: `UsersService`, `UsersController`.

### Documents Module

- **Purpose**: Manages document data, including CRUD operations.
- **Key Components**: `DocumentsService`, `DocumentsController`.

### Ingestion Module

- **Purpose**: Manages the ingestion process, triggering document processing in the Python backend.
- **Key Components**: `IngestionService`, `IngestionController`.

## API Endpoints

### Auth

- **POST /api/auth/register**: Register a new user.
- **POST /api/auth/login**: Authenticate a user and return a JWT.
- **GET /api/auth/profile**: Retrieve the authenticated user's profile.
- **POST /api/auth/logout**: Log out the user and invalidate the JWT.

### Users

- **GET /api/users**: Retrieve all users (Admin only).
- **PATCH /api/users/:id**: Update a user's details (Admin only).
- **PATCH /api/users/:id/role**: Update a user's role (Admin only).
- **PATCH /api/users/:id/permissions**: Update a user's permissions (Admin only).

### Documents

- **POST /api/documents**: Create a new document.
- **GET /api/documents**: Retrieve all documents.
- **GET /api/documents/:id**: Retrieve a document by ID.
- **PATCH /api/documents/:id**: Update a document by ID.
- **DELETE /api/documents/:id**: Delete a document by ID.

### Ingestion

- **POST /api/ingestion/trigger**: Trigger a new ingestion process.
- **GET /api/ingestion/status/:id**: Get the status of a specific ingestion process.
- **GET /api/ingestion/status**: Get the status of all ingestion processes.

## Third-Party Integrations

- **NestJS Axios**: Used for making HTTP requests to the Python backend.
- **TypeORM**: Used for database interactions.
- **Passport**: Used for authentication strategies.
- **Multer**: Used for handling file uploads.

## Microservices and Ingestion Process

The ingestion process is triggered via the `IngestionController`, which sends a request to a Python backend. This backend processes the documents for tasks such as training LLM models. The status of these processes is tracked using the `IngestionService`.

## Docker and RabbitMQ

### Docker

Docker is used to containerize the application, making it easy to deploy and scale. The `Dockerfile` is configured to:

1. Use the official Node.js image as a base.
2. Set the working directory to `/usr/src/app`.
3. Copy `package.json` and `package-lock.json` to the working directory.
4. Install the necessary dependencies.
5. Rebuild `bcrypt` for the correct architecture.
6. Copy the rest of the application code.
7. Build the application.
8. Expose port 3000.
9. Start the application in production mode.

### RabbitMQ

RabbitMQ is used as a message broker to handle asynchronous communication between services. It is configured in the `docker-compose.yml` file, which sets up a RabbitMQ service with a management UI accessible on port 15672.

### Docker Compose

Docker Compose is used to orchestrate the multi-container setup, including the application, PostgreSQL database, and RabbitMQ. The `docker-compose.yml` file ensures that all services are correctly linked and configured with the necessary environment variables.

To set up and run the application using Docker Compose, follow these steps:

1. Ensure Docker and Docker Compose are installed on your machine.
2. Create a `.env` file with the necessary environment variables (see [Environment Variables](#environment-variables)).
3. Run the following command to build and start the containers:

   ```bash
   docker-compose up --build
   ```

4. Access the application at `http://localhost:3000`.
5. Access the RabbitMQ management UI at `http://localhost:15672` with the default credentials specified in the `docker-compose.yml` file.

## Installation

```bash
$ npm install
```

## Running the App

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Environment Variables

Ensure you have a `.env` file with the following variables:

```plaintext
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
DB_DATABASE=your_database_name
PYTHON_BACKEND_URL=http://localhost:5000
RABBITMQ_URL=amqp://user:password@rabbitmq:5672
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in Touch

- Author - [Rahul Rawat](https://hackrest.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).