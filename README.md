# YouTube Mini App (Frontend)

This is the frontend of a YouTube-like mini-application, built with React. It provides a user interface for browsing videos and user authentication.

## 🚀 Features

- **Video Browsing:** Explore a collection of videos in a YouTube-like layout.
- **User Authentication:** Google OAuth integration for user login and logout.
- **Responsive Design:** Optimized for various screen sizes.
- **State Management:** Uses Redux Toolkit for efficient application state handling.
- **Connectivity Check:** Includes a backend connectivity verification component.

## 🌐 Live Demo

The application is live and accessible here:  
👉 https://youtube-mini-app-p93f.onrender.com/

## 🛠️ Technologies Used

- **Frontend Framework:** [React](https://reactjs.org/) (v19)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) & [React-Redux](https://react-redux.js.org/)
- **Routing:** [React Router DOM](https://reactrouter.com/) (v6)
- **API Client:** [Axios](https://axios-http.com/)
- **Authentication:** [Google Cloud Console](https://console.cloud.google.com/welcome/new) (Google OAuth 2.0 (via Google Cloud Console))
- **Styling:** CSS
- **Notifications:** [SweetAlert2](https://sweetalert2.github.io/)

## 📂 Project Structure

```text
src/
├── api/          # API service configurations
├── auth/         # Authentication components (Google Login, Logout)
├── components/   # Shared UI components (Navbar, RouteTracker, etc.)
├── features/     # Redux slices and logic
├── Youtube/      # YouTube-specific components and main page
├── App.jsx       # Root component and routing
├── main.jsx      # Entry point
└── store.js      # Redux store configuration
```

## 🏁 Getting Started

### Prerequisites

- Node.js (Latest version recommended)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd frontend_of_youtube_app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

To create a production build:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 🔌 Connectivity Check Feature

The application includes a robust **Connectivity Check** mechanism (`CheckBackendConnectivity.jsx`) to ensure it communicates with an active backend server.

### How It Works:
1. **Health Check:** On initialization, the app attempts to reach two backend URLs defined in the environment variables.
2. **Endpoint:** It sends a GET request to `${BACKEND_URL}/api/serverStatus`.
3. **Failover Logic:** 
   - It first tries the primary URL (`VITE_BACKEND_URL_1`).
   - If the primary URL fails or times out (3 seconds), it automatically tries the secondary fallback URL (`VITE_BACKEND_URL_2`).
4. **Dynamic Configuration:** Once a live backend is detected, its URL is dispatched to the Redux store and used for all subsequent API calls.
5. **UI Feedback:** If no backend is reachable, a "BACKEND STATUS: DOWN" warning is displayed to the user.

## ⚙️ Configuration (.env)

To run this project, you need to create a `.env` file in the `frontend_of_youtube_app` directory and provide the following values:


- `VITE_BACKEND_URL_1`: The primary (usually local) backend server URL.
- `VITE_BACKEND_URL_2`: The secondary/fallback (usually production) backend server URL.

## 📜 Available Scripts

- `npm run dev`: Starts the development server using Vite.
- `npm run build`: Builds the application for production.
- `npm run lint`: Runs ESLint for code quality checks.
- `npm run preview`: Previews the production build locally.
- `npm run start`: Serves the production build (requires `serve` package).
