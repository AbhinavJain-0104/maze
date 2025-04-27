# Maze Solver

A fullstack maze solver using React (frontend) and FastAPI (backend).

## 🚀 How to Run Locally

### 1. Clone the Repository
```sh
git clone https://github.com/AbhinavJain-0104/maze.git
cd maze
```

### 2. Install Python Dependencies (Backend)
```sh
cd backend
pip install -r requirements.txt
```

### 3. Install Node Dependencies and Build Frontend
```sh
cd ../frontend
npm install
npm run build
```

### 4. Move the React Build to Backend
```sh
mv build ../backend/
```
> If you get an error that the folder already exists, you can delete the old one first:
> ```sh
> rm -rf ../backend/build
> mv build ../backend/
> ```

### 5. Add Maze Images
- Place your maze images (`.jpg`, `.png`, etc.) in the `images/` folder at the root of the project (`maze/images/`).

### 6. Run the Backend (Serves Both API and Frontend)
```sh
cd ../backend
uvicorn app:app --reload
```
- The app will be available at [http://localhost:8000](http://localhost:8000)
- The React frontend and all API endpoints will work from this single URL.

### 7. Open in Browser
Go to [http://localhost:8000](http://localhost:8000) and use the Maze Solver!

---

## 🛠️ Troubleshooting
- If you see "Failed to load images," make sure:
  - The backend is running from the `backend` directory.
  - The `images/` folder exists at the project root and contains images.
- If you get a port conflict, make sure nothing else is running on port 8000.

---

## 📋 Summary Table
| Step | Command |
|------|---------|
| Clone repo | `git clone ...` |
| Install backend deps | `cd backend && pip install -r requirements.txt` |
| Install frontend deps | `cd ../frontend && npm install` |
| Build frontend | `npm run build` |
| Move build | `mv build ../backend/` |
| Run backend | `cd ../backend && uvicorn app:app --reload` |
| Open browser | `http://localhost:8000` |

---

## 📚 Reference
- [Your GitHub Repo](https://github.com/AbhinavJain-0104/maze)

---

If you get stuck, copy the error and ask for help!
