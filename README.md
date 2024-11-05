# Pokemon Battle Game

## Tech Stack

- **Frontend**: React, Vite, Redux Toolkit, Web3
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: MetaMask
- **Deployment**: Heroku

## Installation and Setup

### Clone the Repository

```bash
git clone https://github.com/your-username/pokemon-battle-game.git
cd pokemon-battle-game
```

## Environment Setup

For the Backend (Server)

Create a .env file in the root directory and add the following environment variables:

```bash
MONGODB_URI=<Your MongoDB URI>
JWT_SECRET=<Your JWT secret key>
```

For the Frontend (Client)

In the client folder, create a .env file:

```bash
VITE_API_URL=http://localhost:5000 or VITE_API_URL=https://your-app.herokuapp.com
```

### Install Dependencies

Server

Install server dependencies:

```bash
npm install
```

Client

Navigate to the client folder and install dependencies:

```bash
cd ../client
npm install
```

### Running the Application

From the root directory, start both the client and server:

```bash
npm run dev
```
