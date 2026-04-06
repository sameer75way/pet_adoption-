# Pet Adoption Platform

A full-stack web application built for pet adoption.

## Project Structure

This project is a monorepo containing:
- `/client`: Frontend application built with React, Vite, Redux Toolkit, and Tailwind CSS / MUI.
- `/server`: Backend API built with Node.js, Express, TypeScript, and MongoDB.

## Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB
- Redis

### Setup

1. **Install dependencies:**
   From the root directory, install dependencies for both client and server (if you are using a tool like concurrently or workspaces), or install them separately:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

2. **Environment Variables:**
   - Create a `.env` file in the `server/` directory using the provided keys (make sure to use your own credentials).
   - Create a `.env` file in the `client/` directory if needed.

3. **Run the Application locally:**
   Start the frontend:
   ```bash
   cd client
   npm run dev
   ```

   Start the backend:
   ```bash
   cd server
   npm run dev
   ```


5 **Demo User Details**

Login credentials:
Admin: admin@petadopt.com / password
Staff: staff@petadopt.com / password
Adopter: adopter@petadopt.com / password

