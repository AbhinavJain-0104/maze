import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Tuple
from PIL import Image
import numpy as np
import heapq
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

IMAGES_FOLDER = "../images"

# Serve React build as static files
app.mount("/", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "build"), html=True), name="static")

@app.get("/images")
def list_images():
    return [f for f in os.listdir(IMAGES_FOLDER) if f.lower().endswith((".png", ".jpg", ".jpeg"))]

@app.get("/grid")
def image_to_grid(img: str, threshold: int = 200):
    img_path = os.path.join(IMAGES_FOLDER, img)
    image = Image.open(img_path).convert("L")
    image = image.resize((50, 50))  # Resize for performance
    arr = np.array(image)

    print(np.unique(arr))  # Optional: check grayscale values
    grid = (arr < threshold).astype(int).tolist()
    return {"grid": grid}


@app.post("/astar")
def a_star_solver(payload: dict):
    grid = payload["grid"]
    starts = [tuple(p) for p in payload["starts"]]
    ends = [tuple(p) for p in payload["ends"]]

    shortest_path = None
    for s in starts:
        for e in ends:
            path = a_star(grid, s, e)
            if path and (shortest_path is None or len(path) < len(shortest_path)):
                shortest_path = path

    return {"path": shortest_path}


# === A* Utilities ===

def a_star(grid: List[List[int]], start: Tuple[int, int], end: Tuple[int, int]):
    rows, cols = len(grid), len(grid[0])
    open_set = [(0, start)]
    came_from = {}
    g_score = {start: 0}
    f_score = {start: heuristic(start, end)}
    visited = set()

    while open_set:
        _, current = heapq.heappop(open_set)
        if current == end:
            return reconstruct_path(came_from, current)

        if current in visited:
            continue
        visited.add(current)

        for dx, dy in [(-1,0),(1,0),(0,-1),(0,1)]:
            neighbor = (current[0] + dx, current[1] + dy)
            if 0 <= neighbor[0] < rows and 0 <= neighbor[1] < cols and grid[neighbor[0]][neighbor[1]] == 1:
                tentative_g = g_score[current] + 1
                if tentative_g < g_score.get(neighbor, float('inf')):
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g
                    f_score[neighbor] = tentative_g + heuristic(neighbor, end)
                    heapq.heappush(open_set, (f_score[neighbor], neighbor))
    return []

def heuristic(a: Tuple[int, int], b: Tuple[int, int]):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

def reconstruct_path(came_from, current):
    path = [current]
    while current in came_from:
        current = came_from[current]
        path.append(current)
    return path[::-1]
