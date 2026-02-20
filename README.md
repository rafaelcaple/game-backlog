# Game Backlog - Frontend

Interface for managing your personal game backlog, integrated with the [Game Backlog API](https://github.com/rafaelcaple/game-backlog-backend).

Built to practice REST API development with Spring Boot and full-stack integration between a Java backend and a React frontend.

## Live Demo

[[→ game-backlog-topaz.vercel.app]](https://game-backlog-topaz.vercel.app)

## Features

- Search games by name
- Save games to your backlog
- Track status: Backlog, Playing, Completed or Dropped
- Remove games from the list

## Tech Stack

- React
- JavaScript
- CSS
- Vite

## Backend Repository

[game-backlog-backend](https://github.com/rafaelcaple/game-backlog-backend) — Spring Boot REST API integrated with this frontend.

## Future Implementations

- Add login system so each user can have their own backlog
- Switch to a more complete game database (IGDB)
- Game rating system

## How to run

### Prerequisites
- Node.js 18+
- Backend running locally or in production

### Setup

1. Clone the repository
```bash
git clone https://github.com/rafaelcaple/game-backlog.git
```

2. Install dependencies
```bash
npm install
```

3. Configure the backend URL in the environment file
```bash
VITE_API_URL=http://localhost:8080
```

4. Run the application
```bash
npm run dev
```

The application will be available at `http://localhost:5173`
