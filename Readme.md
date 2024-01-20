# Scooterson Backend assignment

## Table of Content

- [Scooterson Backend assignment](#scooterson-backend-assignment)
  - [Table of Content](#table-of-content)
  - [Introduction](#introduction)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Install](#install)
    - [Run using docker](#run-using-docker)
    - [Running locally](#running-locally)
  - [Project Structure](#project-structure)
  - [API Endpoints](#api-endpoints)
  - [Authentication, Authorization and Security](#authentication-authorization-and-security)
  - [DB Schema](#db-schema)

## Introduction

This document provides an overview of the system architecture, how to set up and run the project, details about the database schema, API endpoints etc.

## Getting Started

### Prerequisites

- Node.js (version 20.9.9)
- npm (version 10.1.0)
- Docker (for running mongodb in a container)

### Install

Clone the repo

```bash
git clone https://github.com/priyam-anand/scooterson.git
```

Navigate to the directory

```bash
cd scooterson
```

Generate SSL certificate (NOTE : This will generate a self signed certificate)

```bash
yarn gen:cert
```

### Run using docker

```bash
docker-compose up
```

### Running locally

Add environment variables to .env file using .env.sample as a reference

Install dependencies

```bash
yarn install
```

Build the project

```bash
yarn build:local
```

Start the project

```bash
yarn start
``````

## Project Structure

The project follows a modular structure:

- **config/**: Contains configuration files, including config.ts.
- **controller/**: controllers responsible for different parts of the application logic, such as authentication, protected routes, and user actions.
- **db/**:
  - **db.ts**: Manages database connections.
  - **models/**: Defines database models, such as user.ts.
- **middleware/**:
  - **auth.ts**: Middleware for authentication.
  - **ratelimiter.ts**: Middleware for rate limiting.
- **services/**:
  - **auth.ts**: Service handling authentication logic.
  - **user.ts**: Service handling user-related logic.
- **utils/**: Various utility files for the application
- **app.ts**: Main entry point of the application.
- **docker-compose.yml**: Docker Compose configuration for the application and MongoDB.
- **Dockerfile**: Configuration for building a Docker image for the application.
- **gen_cert.sh**: Shell script for generating certificates.
- **package.json**: Node.js package configuration file.
- **Readme.md**: Documentation file providing information about the project.
- **routes.ts**: File defining the application routes.
- **tsconfig.json**: TypeScript configuration file.
- **yarn.lock**: Yarn package manager lock file.

## API Endpoints

The API provides the following endpoints:

- **POST** /auth/register: User registration.

    ```json
    body : {
        email : "email@host.com" // a unique and valid email
        password : "password" // password with minium length of 6
    }
    ```

- **POST** /auth/login: User login.

    ```json
    body : {
        email : "email@host.com" // registed email
        password : "password" // registed password
    }
    ```

- **POST** /auth/refresh: Get new access and refresh token

    ```json
    body : {
        refreshToken : "eyJhbGci...." // valid jwt refresh token
    }
    ```

- **POST** /user/changeRole: Change role of a user

    ```json
    header : {
        "Authorization" : "Bearer eyJhbGci...Access-Token"
    }
    body : {
        "role" : "ADMIN" // new role for this user. Can be chosen from ADMIN, USER or OPERATOR. ROLES ARE CASE SENSITIVE.
    }
    ```

- **GET**  protected/ : mimics an endpoint open to all users. No access control
- **GET**  protected/admin : mimics an endpoint open to only ADMIN level of access
- **GET**  protected/operator : mimics an endpoint open to OPERATOR or higher level of access
- **GET**  protected/user :  mimics an endpoint open to USER or higher level of access

## Authentication, Authorization and Security

- The system uses JSON Web Tokens (JWT) for secure authentication.
- Role-based authorization is implemented using middleware to restrict access to certain routes based on user roles.
- Security measures include password encryption, token expiration, HTTPS for secure communication, and validation of user inputs
- Rate limiting is included to help with DDos attacks etc.

## DB Schema

The MongoDB database includes collections for users, following a schema defined in *db/models/*.
