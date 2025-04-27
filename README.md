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
- **Important:** Place your maze images (`.jpg`, `.png`, etc.) in the folder:
  - `C:\maze_test_images` (recommended, especially on Windows)
- If the folder does not exist, create it manually and copy your images there.

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
- **Images not loading?**
  - Make sure your images are in `C:\maze_test_images`.
  - The backend prints the images directory path on startup. Confirm it matches your images location.
- **Maze points not mapping correctly?**
  - Ensure you are running the latest code. The frontend now maps clicks to the grid using the original image size and grid size.
- **No path found?**
  - Make sure you are clicking on open paths (not walls) in the maze image.
  - The grid is generated from a resized version of the image (max 100x100). For best results, use clear, high-contrast maze images.
- **Port conflict?**
  - Make sure nothing else is running on port 8000.

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
