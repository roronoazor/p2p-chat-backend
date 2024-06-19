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

## Requirements

- Node.js v16 or above
- SQLite

## Getting Started

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/your-repo/nestjs-chat-app.git
   cd nestjs-chat-app
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

2. Deploy the database

   ```bash
   npx prisma db push
   ```

3. Command to start the application in development mode

   ```bash
   npm run start:dev
   ```

4. Start the application

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

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

This README provides a comprehensive overview of the NestJS Chat Application, including its features, installation instructions, and details on how to run the application both with and without a Makefile. The Makefile commands are also documented for ease of use.
