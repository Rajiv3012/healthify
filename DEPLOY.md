# Deployment Guide

Your application has been refactored to be a "monolith" where the backend (Node.js/Express) serves the frontend (React/Vite). This makes deployment very simple.

## Deployment Options

You can deploy this project to any hosting provider that supports Node.js. Here are the instructions for **Render**, which offers a free tier.

### Option 1: Deploy to Render (Free)

1.  **Push your code to GitHub/GitLab**.
2.  Create a **Web Service** on [Render](https://dashboard.render.com/).
3.  Connect your repository.
4.  Use the following settings:
    *   **Runtime**: Node
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `npm start`
5.  Click **Create Web Service**.

That's it! Render will:
1.  Install dependencies.
2.  Build the React frontend (creating the `dist` folder).
3.  Start `server.js`, which serves both the API and the React app.

### Option 2: Deploy to Railway / Heroku

The logic is identical:
*   **Build Command**: `npm install && npm run build`
*   **Start Command**: `npm start`

## Local Production Run

To run the application in "production mode" locally (just like it will run on the server):

1.  Build the app: `npm run build`
2.  Start the server: `npm start`
3.  Open `http://localhost:3000`

## Notes

*   **API URL**: The app now automatically detects if it's in production.
    *   Development (`npm run dev`): Uses `http://localhost:3000/api`
    *   Production: Uses `/api` (relative path)
*   **Database**: The current database is **in-memory** in `server.js`.
    *   *Warning*: On free hosting tiers (like Render Free), the server restarts after inactivity, **wiping the data**.
    *   For a real app, you should connect to a customized MongoDB code (Atlas) or PostgreSQL.
