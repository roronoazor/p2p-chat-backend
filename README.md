## README

# NestJS P2P Chat Application

## Overview

The NestJS Chat Application is a real-time chat service built using NestJS and Socket.IO. The application is designed to provide a robust and scalable platform for peer-to-peer chat functionality. Users can register, login, and engage in real-time messaging with other users. The application also supports offline message storage, ensuring messages are delivered when users come online.

## Features

- User Registration and Authentication
- Real-time messaging with Socket.IO
- Online/offline user status tracking
- Offline message storage and delivery
- Search functionality for users
- Prisma ORM for database interactions
- SQLite database for development

## Design Choices

To minimize the number of dependencies required to set up the application for both the frontend and backend, Node.js was chosen as the backend. This allows a user to only need Node.js and npm to get up and running without the hassle of having to install Node.js for the frontend and another programming language like Python or Java for the backend. SQLite was chosen as the database of choice because it is a file-based database and does not require the user to download a separate database system like MongoDB or PostgreSQL. However, in production, it is expected that the SQLite database would be swapped out for a production-grade database.

To keep track of online users that have connected to the server, an in-memory map was used. This is sufficient for a small and simple application like this, but in production, a preferred alternative would be Redis as it provides persistence and distributed storage across multiple servers, unlike an in-memory database which would lose all its data when the server is restarted. Also Redis was avoided to further reduce the number of dependencies that would be needed to be setup to run this application.

## Requirements

- Node.js v16 or above
- SQLite

## Getting Started

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/roronoazor/p2p-chat-backend.git
   cd p2p-chat-backend
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory and add the following:
   ```
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your_jwt_secret"
   ```

### Running the Application

#### Using Makefile

1. Run database migrations

   ```bash
   make migrate
   ```

2. Deploy the database

   ```bash
   make deploy
   ```

3. Start the application in development mode

   ```bash
   make start-dev
   ```

4. Start the application

   ```bash
   make start
   ```

#### Without Makefile

1. Run database migrations

   ```bash
   npx prisma migrate dev
   ```

2. Start the application in development mode

   ```bash
   npm run start:dev
   ```

3. Start the application

   ```bash
   npm run start
   ```

## API Endpoints

### Authentication

- **POST /auth/register**: Register a new user
- **POST /auth/login**: Login a user

### Users

- **GET /users**: Get a list of users
- **GET /users/:id**: Get a specific user by ID

### WebSocket Events

- **userOnline**: Notify when a user is online
- **userOffline**: Notify when a user is offline
- **sendMessage**: Send a message to another user
- **messageReceived**: Receive a message from another user
- **searchUsers**: Search for users by email or phone number
