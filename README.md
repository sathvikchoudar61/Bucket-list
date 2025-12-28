# Bucket List App

A modern, interactive "Bucket List" application designed to help you organize and track your life goals, adventures, and dreams. Built with a lightweight Python Flask backend and a responsive Vanilla JavaScript frontend.

## 🚀 Features

-   **Goal Management**: Add, edit, and delete bucket list items effortlessly.
-   **Rich Details**: specificy priorities (High, Medium, Low), due dates, and detailed notes for each item.
-   **Categorization**: Organize items into categories like Travel, Career, Learning, Adventure, Health, and more.
-   **Drag & Drop**: Intuitive drag-and-drop interface to reorder items within categories.
-   **Progress Tracking**: Real-time stats dashboard showing total items, completed goals, and remaining adventures.
-   **Data Persistence**: Your list is automatically saved to a local JSON file (`data/bucket.json`), so you never lose your progress.
-   **Responsive Design**: A clean, modern UI that works well on different screen sizes.

## 🛠️ Tech Stack

### Frontend
-   **HTML5 & CSS3**: Custom-styled for a modern look without external heavy frameworks.
-   **Vanilla JavaScript (ES6+)**: Handles dynamic DOM manipulation, drag-and-drop logic, and API communication.

### Backend
-   **Python 3.x**: Core language for the backend logic.
-   **Flask**: Lightweight web framework for handling API requests.
-   **Flask-CORS**: Handles Cross-Origin Resource Sharing to allow the frontend to communicate with the backend.

### Data Storage
-   **JSON File System**: Simple, file-based persistence using `data/bucket.json`. No need to set up a complex database server.

## ⚙️ Setup & Installation

### Prerequisites
-   **Python 3.x** installed on your system.

### Installation

1.  **Clone or Download** the project repository.
2.  **Install Dependencies**:
    Open a terminal/command prompt and run:
    ```bash
    pip install flask flask-cors
    ```

## ▶️ How to Run

### Windows (Easy Method)
Double-click the **`run_server.bat`** file in the project root. This script will automatically:
1.  Start the Flask Backend server (Port 8000).
2.  Start a local Python HTTP server for the Frontend (Port 5500).
3.  Open the application in your default web browser (`http://localhost:5500/index.html`).

### Manual Method
If you prefer to run it manually via terminal:

1.  **Start Backend**:
    ```bash
    cd backend
    python app.py
    ```
    *Server runs at `http://localhost:8000`*

2.  **Start Frontend**:
    Open a new terminal window in the project root:
    ```bash
    cd frontend
    python -m http.server 5500
    ```
    *Access the app at `http://localhost:5500/index.html`*

## 📂 Project Structure

```
bucket-list/
├── backend/
│   ├── app.py           # Main Flask application
│   └── data/            # (Created automatically) Stores bucket.json
├── frontend/
│   ├── index.html       # Main HTML structure
│   ├── styles.css       # Application styling
│   └── app.js           # Frontend logic (API calls, UI updates)
├── run_server.bat       # Windows automation script
└── README.md            # Project documentation
```

## 📝 API Endpoints

-   `GET /items`: Retrieve all bucket list items.
-   `POST /items`: Save the entire list of items (used for adding, updating, reordering, and deleting).

---
*Created for the dreamer in you.*
