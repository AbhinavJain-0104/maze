import React, { useEffect, useRef, useState } from "react";

const cellSize = 20; // Increased cell size for better visibility
const maxGridWidth = 800;
const maxGridHeight = 600;

const MazeCanvas = ({ grid, starts, ends, setStarts, setEnds, path }) => {
  const canvasRef = useRef(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || grid.length === 0) return;

    const ctx = canvas.getContext("2d");
    canvas.width = grid[0].length * cellSize;
    canvas.height = grid.length * cellSize;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid: 1=open (white), 0=wall (dark)
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        if (grid[y][x] === 1) {
          ctx.fillStyle = "#fff"; // open cell
        } else {
          ctx.fillStyle = "#2c3e50"; // wall
        }
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        ctx.strokeStyle = "#d0d7de";
        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }

    // Draw path
    if (path.length > 0) {
      path.forEach(([y, x]) => {
        ctx.fillStyle = "#3498db";
        ctx.beginPath();
        ctx.arc(
          x * cellSize + cellSize/2,
          y * cellSize + cellSize/2,
          cellSize/3,
          0,
          2 * Math.PI
        );
        ctx.fill();
      });
      // Draw emoji at the end of the path
      const [ey, ex] = path[path.length - 1];
      ctx.font = `${cellSize}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🚶", ex * cellSize + cellSize/2, ey * cellSize + cellSize/2);
    }

    // Draw starts with a thick green border
    starts.forEach(([y, x]) => {
      ctx.save();
      ctx.shadowColor = "#27ae60";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#2ecc71";
      ctx.beginPath();
      ctx.arc(
        x * cellSize + cellSize/2,
        y * cellSize + cellSize/2,
        cellSize/2.1,
        0,
        2 * Math.PI
      );
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#145a32";
      ctx.stroke();
      ctx.restore();
    });

    // Draw ends with a thick red border
    ends.forEach(([y, x]) => {
      ctx.save();
      ctx.shadowColor = "#e74c3c";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#e74c3c";
      ctx.beginPath();
      ctx.arc(
        x * cellSize + cellSize/2,
        y * cellSize + cellSize/2,
        cellSize/2.1,
        0,
        2 * Math.PI
      );
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#922b21";
      ctx.stroke();
      ctx.restore();
    });
  }, [grid, starts, ends, path]);

  // Left click: start, Right click: end
  const handleCanvasClick = (e) => {
    if (!grid.length) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);

    // Only allow placing on open cells (1)
    if (grid[y][x] !== 1) {
      setMessage("Cannot place on a wall (obstacle)!");
      setTimeout(() => setMessage(""), 1200);
      return;
    }

    // Prevent duplicate points
    if (starts.some(([sy, sx]) => sy === y && sx === x) || ends.some(([ey, ex]) => ey === y && ex === x)) {
      setMessage("Point already placed here!");
      setTimeout(() => setMessage(""), 1200);
      return;
    }

    // Left click (start)
    if (e.button === 0) {
      setStarts((prev) => [...prev, [y, x]]);
    }
  };

  // Right click: end
  const handleCanvasContextMenu = (e) => {
    e.preventDefault();
    if (!grid.length) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);

    // Only allow placing on open cells (1)
    if (grid[y][x] !== 1) {
      setMessage("Cannot place on a wall (obstacle)!");
      setTimeout(() => setMessage(""), 1200);
      return;
    }

    // Prevent duplicate points (don't allow end on a start)
    if (starts.some(([sy, sx]) => sy === y && sx === x)) {
      setMessage("Point already placed here!");
      setTimeout(() => setMessage(""), 1200);
      return;
    }

    // Only one end allowed: replace previous end
    setEnds([[y, x]]);
  };

  // Calculate canvas size for scrollable container
  const canvasWidth = grid[0]?.length * cellSize || 0;
  const canvasHeight = grid.length * cellSize || 0;

  return (
    <div style={{ 
      marginTop: "20px",
      textAlign: "center"
    }}>
      <div style={{
        backgroundColor: "#f8f9fa",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        marginBottom: "10px"
      }}>
        <div style={{ marginBottom: "10px", color: "#2c3e50", fontWeight: "bold" }}>
          Left Click: Place Start &nbsp;|&nbsp; Right Click: Place End
        </div>
        {message && (
          <div style={{ color: "#e74c3c", marginTop: "8px", fontWeight: "bold" }}>{message}</div>
        )}
        <div style={{
          maxWidth: maxGridWidth,
          maxHeight: maxGridHeight,
          overflow: "auto",
          margin: "0 auto"
        }}>
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onContextMenu={handleCanvasContextMenu}
            width={canvasWidth}
            height={canvasHeight}
            style={{
              border: "3px solid #34495e",
              borderRadius: "4px",
              backgroundColor: "#ffffff",
              display: "block",
              margin: "0 auto",
              cursor: "crosshair"
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MazeCanvas;
