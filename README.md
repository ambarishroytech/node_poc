# Secure Group Messaging API

This project is a Node.js backend for a secure group messaging application. It supports user authentication, group management, and real-time messaging using REST APIs and Socket.IO.

---

## Table of Contents
- [Secure Group Messaging API](#secure-group-messaging-api)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Prerequisites](#prerequisites)
  - [Setup Instructions](#setup-instructions)
  - [Running the Application](#running-the-application)
  - [API Documentation](#api-documentation)
  - [Real-Time Messaging](#real-time-messaging)
  - [Postman Collection](#postman-collection)
  - [Simulator Client](#simulator-client)
  - [Troubleshooting](#troubleshooting)
  - [Known issues or Limitations](#known-issues-or-limitations)

---

## Features
- User registration and authentication (JWT)
- Group creation, joining, and management
- Sending and retrieving messages
- Real-time messaging with Socket.IO
- RESTful API endpoints
- Input validation and error handling

---

## Tech Stack
- Node.js
- Express.js
- TypeScript
- Socket.IO
- Jest (testing)
- [See `docs/Tech-Stack and 3rd-Party Libraries.txt` for details]

---

## Prerequisites
- Node.js (v16 or above)
- npm (v8 or above)
- A running SQL database (see `db_scripts/schema.sql` for schema)

---

## Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone https://github.com/ambarishroytech/node_poc.git
   cd node_poc
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the root directory.
   - Add the following variables (example):
     ```env
     PORT=3000
     WEB_SERVER=http://localhost
     DB_HOST=localhost
     DB_PORT=5432
     DB_USER=your_db_user
     DB_PASSWORD=your_db_password
     DB_NAME=your_db_name
     JWT_SECRET=your_jwt_secret
     ```

4. **Set up the database:**
   - Create a SQL server database.
   - Run the SQL script in `db_scripts/schema.sql` to create the required tables and stored procedures.

5. **(Optional) Configure logging:**
   - Log files are stored in the `logs/` directory.
   - You can adjust logging settings in `src/config/logger.ts`.

---

## Running the Application

Start the backend server:
```sh
npm run build   # Compile TypeScript (if needed)
npm start       # Start the server
```

The server will run on the port specified in your `.env` file (default: 3000).

---
## API Documentation
- API endpoints are defined in `src/routes/v1/`.
- You can use the provided Postman collection for testing (see below).
- (Optional) Swagger documentation can be enabled/configured in `src/config/swagger.ts`.
to see API documentation run this on browser: "http:localhost:3000/api-docs"

---

## Real-Time Messaging
- Real-time messaging is implemented using Socket.IO.
- Clients must connect via Socket.IO and join group rooms to receive group messages.
- See `Simulator/` for sample Node.js clients.
- For browser or other clients, use the Socket.IO client library.
---

## Postman Collection
- A ready-to-use Postman collection is available at `docs/LY.postman_collection.json`.
- To use:
  1. Open Postman.
  2. Click **Import** and select the JSON file.
  3. Use the collection to test all API endpoints.

---

## Simulator Client
- The `Simulator/` folder contains a sample Node.js client for simulating users and groups.
- There are 3 clients for 3 groups (id = 1, id = 2, id = 3)
- to run simulators 
- node src/index1.js
- node src/index2.js
- node src/index3.js

---

## Troubleshooting
- Check the `logs/` directory for error and combined logs.
- Ensure your database is running and accessible.
- For real-time issues, ensure both server and client use the same Socket.IO protocol version.

---

## Known issues or Limitations
A few unit test methods I have added but those are not fully completed and not all are currently passing. I need time to complete them.

---