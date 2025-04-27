import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Tuple
from PIL import Image, ImageOps
import numpy as np
import heapq
from fastapi.staticfiles import StaticFiles
from scipy import ndimage

app = FastAPI()

print("Images directory absolute path:", os.path.abspath("../images"))

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

IMAGES_FOLDER = r"C:\maze_test_images"
print("Images directory absolute path:", IMAGES_FOLDER)

@app.get("/images")
def list_images():
    files = [f for f in os.listdir(IMAGES_FOLDER) if f.lower().endswith((".png", ".jpg", ".jpeg"))]
    print("Files in images folder:", files)
    return files
    
def preprocess_image(image: Image.Image) -> np.ndarray:
    # Convert to grayscale if not already
    if image.mode != 'L':
        image = image.convert('L')

    # Do NOT invert image; assume black is wall, white is path
    # image = ImageOps.invert(image)

    # Convert to numpy array
    arr = np.array(image)

    # Use a fixed threshold (e.g., 128)
    arr = (arr > 128).astype(np.uint8) * 255

    # (Optional) Slight dilation to thicken walls if needed
    # arr = ndimage.binary_dilation(arr, structure=np.ones((2,2))).astype(np.uint8) * 255

    return arr

def find_optimal_grid_size(arr: np.ndarray) -> Tuple[int, int]:
    # Calculate the average size of white regions
    white_regions = arr == 255
    labeled_array, num_features = ndimage.label(white_regions)
    
    if num_features == 0:
        return 50, 50  # Default size if no white regions found
    
    # Calculate average region size
    region_sizes = ndimage.sum(white_regions, labeled_array, range(1, num_features + 1))
    avg_size = np.mean(region_sizes)
    
    # Calculate grid dimensions
    total_pixels = arr.shape[0] * arr.shape[1]
    grid_size = int(np.sqrt(total_pixels / (avg_size * 2)))  # Factor of 2 for spacing
    
    # Ensure minimum size
    grid_size = max(grid_size, 30)
    
    # Calculate dimensions maintaining aspect ratio
    aspect_ratio = arr.shape[1] / arr.shape[0]
    width = int(grid_size * aspect_ratio)
    height = grid_size
    
    return height, width

@app.get("/grid")
def image_to_grid(img: str):
    img_path = os.path.join(IMAGES_FOLDER, img)
    image = Image.open(img_path).convert("L")  # Grayscale

    # Increase grid size for better wall preservation
    max_dim = 200  # Increased from 100
    if image.width > max_dim or image.height > max_dim:
        image = image.resize((max_dim, max_dim), Image.NEAREST)

    arr = np.array(image)
    # White (>= 200) is wall, black (< 200) is path
    grid = (arr < 200).astype(int).tolist()

    # Print ASCII grid for debugging
    print("\n".join("".join("#" if cell == 0 else "." for cell in row) for row in grid))

    return {"grid": grid}

@app.post("/astar")
def a_star_solver(payload: dict):
    grid = payload["grid"]
    starts = [tuple(p) for p in payload["starts"]]
    ends = [tuple(p) for p in payload["ends"]]
    print("Received grid (first 5 rows):", grid[:5])
    print("Start points:", starts)
    print("End points:", ends)
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

# Serve images
app.mount("/images", StaticFiles(directory=IMAGES_FOLDER), name="images")

# Serve React build as static files (MUST BE LAST)
app.mount("/", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "build"), html=True), name="static")
