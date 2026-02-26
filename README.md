# Lens of Judgment

A full-stack movie review and rating platform where users can rate, review, and share their opinions on movies using a unique 4-tier rating system.

## Features

- **4-Tier Rating System** — Rate movies as Skip 👎, Timepass 😐, Go for it 👍, or Perfection 🤩
- **Movie Discovery** — Browse popular, trending, and genre-based movie listings powered by TMDB
- **Search** — Find movies by title
- **Reviews** — Write reviews (up to 1000 characters), like other reviews, and view community feedback
- **User Profiles** — Register, log in, and manage your profile with personalized tags
- **Bookmarks** — Save movies to watch later
- **Community** — See top reviewers and community discussions
- **Notifications** — Stay updated with alerts

## Tech Stack

### Frontend

- React 18 with TypeScript
- Vite
- Tailwind CSS
- shadcn-ui (Radix UI primitives)
- React Router
- React Query
- React Hook Form + Zod
- Recharts

### Backend

- Express 5 with TypeScript
- MongoDB / Mongoose
- JWT authentication
- bcryptjs password hashing
- Express Rate Limit
- TMDB API integration

## Project Structure

```
├── src/                  # Frontend source
│   ├── pages/            # Page components (Home, Search, Profile, etc.)
│   ├── components/       # UI components
│   ├── contexts/         # React contexts (Auth)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # API client and utilities
│   └── main.tsx          # Entry point
├── server/               # Backend source
│   ├── routes/           # API routes (auth, movies, reviews)
│   ├── models/           # Mongoose models (User, Review)
│   ├── services/         # TMDB service
│   ├── middleware/        # Auth and rate limiting
│   ├── config/           # Database and JWT configuration
│   └── index.ts          # Express server entry point
└── public/               # Static assets
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm
- A [MongoDB](https://www.mongodb.com/) instance
- A [TMDB API key](https://www.themoviedb.org/documentation/api)

### Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/Himanth-reddy/lens-of-judgment-app.git
   cd lens-of-judgment-app
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the project root (see `.env.example`):

   ```env
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
   TMDB_API_KEY=your_tmdb_api_key_here
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   CORS_ORIGIN=http://localhost:8080
   ```

4. Start the backend server:

   ```sh
   npm run server
   ```

5. In a separate terminal, start the frontend dev server:

   ```sh
   npm run dev
   ```

   The frontend runs at `http://localhost:8080` and proxies API requests to the backend on port 5000.

## Scripts

| Command           | Description                                      |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Start the Vite development server                |
| `npm run server`  | Start the Express backend server                 |
| `npm run build`   | Build the frontend and compile the server        |
| `npm start`       | Run the production server                        |
| `npm run lint`    | Run ESLint                                       |
| `npm test`        | Run tests with Vitest                            |

## API Endpoints

### Auth

| Method | Endpoint             | Description               |
| ------ | -------------------- | ------------------------- |
| POST   | `/api/auth/register` | Register a new user       |
| POST   | `/api/auth/login`    | Log in                    |
| GET    | `/api/auth/me`       | Get the current user      |
| PUT    | `/api/auth/tags`     | Update user tags          |

### Movies

| Method | Endpoint                 | Description                  |
| ------ | ------------------------ | ---------------------------- |
| GET    | `/api/movies/popular`    | Get popular movies           |
| GET    | `/api/movies/trending`   | Get trending movies          |
| GET    | `/api/movies/genres`     | Get available genres         |
| GET    | `/api/movies/discover`   | Discover movies by genre     |
| GET    | `/api/movies/search`     | Search movies                |
| GET    | `/api/movies/:id`        | Get movie details            |

### Reviews

| Method | Endpoint                        | Description                  |
| ------ | ------------------------------- | ---------------------------- |
| GET    | `/api/reviews/:movieId`         | Get reviews for a movie      |
| GET    | `/api/reviews/user/:username`   | Get a user's reviews         |
| POST   | `/api/reviews`                  | Create a review              |
| PUT    | `/api/reviews/:reviewId`        | Edit a review                |
| POST   | `/api/reviews/:reviewId/like`   | Like or unlike a review      |
| DELETE | `/api/reviews/:reviewId`        | Delete a review              |

## License

This project is private.
