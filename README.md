# Tournament Manager

Tournament Manager is a full-stack web application for managing sports tournaments. It consists of a backend API and a frontend client.

## Technologies Used

- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **Database**: SQLite
- **Containerization**: Docker

## How to Run the Project

You can run this project using Docker (recommended for production) or by setting up local development environments for the backend and frontend separately.

### Using Docker

The easiest way to get the application running is by using Docker Compose.

**Prerequisites:**
- Docker installed on your machine.

**Steps:**
1. Clone the repository.
2. Create a `.env` file in the `backend` directory by copying the example file:
   ```bash
   cp backend\.env.example backend\.env
   ```
3. From the root directory of the project, run the following command:
   ```bash
   docker-compose up --build
   ```
This command will build the Docker images for both the backend and frontend services and start the containers.

- The **frontend** will be available at `http://localhost:5173`.
- The **backend API** will be available at `http://localhost:3000`.
