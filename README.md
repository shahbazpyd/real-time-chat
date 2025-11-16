# Real-Time Chat Application

This is a full-stack, real-time chat application built as a learning project. It features a Django backend that serves a REST API and handles WebSocket connections, and a React frontend for a dynamic user experience.

## Features

- **Real-Time Messaging:** Instant message delivery using Django Channels and WebSockets.
- **User Authentication:** Secure user registration and login using JSON Web Tokens (JWT).
- **RESTful API:** A well-structured API built with Django REST Framework to manage users, messages, and authentication.
- **Responsive Frontend:** A clean and simple user interface built with React and React-Bootstrap.
- **CORS Enabled:** Configured to allow communication between the frontend and backend servers during development.

---

## Tech Stack

| Component | Technology |
| :--- | :--- |
| **Backend** | Python, Django, Django REST Framework |
| **Real-Time** | Django Channels, WebSockets, Daphne (ASGI Server) |
| **Authentication** | `djangorestframework-simplejwt` (JWT) |
| **Database** | SQLite (Development), PostgreSQL (Production Ready) |
| **Frontend** | React, Vite |
| **UI Library** | React-Bootstrap, Bootstrap |
| **Linting/Formatting**| ESLint, Prettier |

---

## Project Structure

The project is organized into two main directories:

```
real-time-chat/
├── backend/         # Contains the Django project
│   ├── chat/        # Django app for chat functionality
│   ├── backend/     # Project settings, ASGI/WSGI configs, and root URLs
│   └── manage.py
└── frontend/        # Contains the React project
    ├── public/
    ├── src/
    └── package.json
```

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Python 3.10+
- Node.js v16+ and npm

### Backend Setup

1.  **Navigate to the backend directory:**
    ```sh
    cd backend
    ```

2.  **Create and activate a virtual environment:**
    ```sh
    # For Windows
    python -m venv venv
    .\venv\Scripts\activate

    # For macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install Python dependencies:**
    ```sh
    pip install -r requirements.txt
    ```
    *(Note: You may need to create a `requirements.txt` file first: `pip freeze > requirements.txt`)*

4.  **Apply database migrations:**
    ```sh
    python manage.py migrate
    ```

5.  **Run the development server:**
    The backend uses Daphne as the ASGI server to handle both HTTP and WebSocket traffic.
    ```sh
    python manage.py runserver
    ```
    The backend will be running at `http://127.0.0.1:8000`.

### Frontend Setup

1.  **Navigate to the frontend directory in a new terminal:**
    ```sh
    cd frontend
    ```

2.  **Install Node.js dependencies:**
    ```sh
    npm install
    ```

3.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The React frontend will be available at `http://localhost:5173`.

---

## License

This project is intended for learning purposes. The included dependencies have their own licenses, which can be found in the `node_modules` directory and Python package metadata.