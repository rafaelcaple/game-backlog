# Game Backlog - Frontend

Interface for managing your personal game backlog, integrated with the [Game Backlog API](https://github.com/rafaelcaple/game-backlog-backend).

### [Live Demo](https://game-backlog-topaz.vercel.app/) 
### [Backend Repository](https://github.com/rafaelcaple/game-backlog-backend)

## Tech Stack

- React
- JavaScript
- CSS
- Vite

## Features

- User registration and login with JWT authentication
- Search games by name
- Save games to your backlog
- Track status: Backlog, Playing, Completed or Dropped
- Update game status directly from the list
- Real-time counter by status
- Remove games from the list with confirmation dialog

## How to Run

### Prerequisites

- Node.js 18+
- Backend running locally or in production

### Setup

**1. Clone the repository**

```bash
git clone https://github.com/rafaelcaple/game-backlog
cd game-backlog
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure the backend URL**

Create a `.env` file at the root of the project:

```
VITE_API_URL=http://localhost:8080
```

**4. Run the application**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`
