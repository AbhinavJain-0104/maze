import React, { useEffect, useRef, useState } from "react";

const maxDisplayWidth = 900; // Adjust as needed
const maxDisplayHeight = 700;

const MazeCanvas = ({ imageName, starts, ends, setStarts, setEnds, path, grid }) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [message, setMessage] = useState("");
  const [imgDims, setImgDims] = useState({ width: 0, height: 0, origWidth: 0, origHeight: 0, scale: 1 });

  // Load image and set dimensions
  useEffect(() => {
    if (!imageName) return;
    const img = new window.Image();
    img.src = `http://localhost:8000/images/${imageName}`;
    img.onload = () => {
      // Scale to fit container
      let scale = Math.min(
        maxDisplayWidth / img.width,
        maxDisplayHeight / img.height,
        1
      );
      setImgDims({
        width: img.width * scale,
        height: img.height * scale,
        origWidth: img.width,
        origHeight: img.height,
        scale,
      });
    };
    imageRef.current = img;
  }, [imageName]);

  // Draw overlay (points, path)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgDims.width || !grid) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw path
    if (path && path.length > 0) {
      ctx.strokeStyle = "#3498db";
      ctx.lineWidth = 3;
      ctx.beginPath();
      path.forEach(([y, x], idx) => {
        const px = (x / grid[0].length) * imgDims.width;
        const py = (y / grid.length) * imgDims.height;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
      // Draw emoji at the end
      const [ey, ex] = path[path.length - 1];
      const px = (ex / grid[0].length) * imgDims.width;
      const py = (ey / grid.length) * imgDims.height;
      ctx.font = `${24 * imgDims.scale}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🚶", px, py);
    }

    // Draw starts
    starts.forEach(([y, x]) => {
      ctx.save();
      ctx.shadowColor = "#27ae60";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#2ecc71";
      const px = (x / grid[0].length) * imgDims.width;
      const py = (y / grid.length) * imgDims.height;
      ctx.beginPath();
      ctx.arc(px, py, 12, 0, 2 * Math.PI);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#145a32";
      ctx.stroke();
      ctx.restore();
    });
    // Draw ends
    ends.forEach(([y, x]) => {
      ctx.save();
      ctx.shadowColor = "#e74c3c";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#e74c3c";
      const px = (x / grid[0].length) * imgDims.width;
      const py = (y / grid.length) * imgDims.height;
      ctx.beginPath();
      ctx.arc(px, py, 12, 0, 2 * Math.PI);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#922b21";
      ctx.stroke();
      ctx.restore();
    });
  }, [imgDims, starts, ends, path, grid]);

  // Map canvas click to grid index using original image size and grid size
  const mapToGrid = (x, y) => {
    if (!grid || !imgDims.width || !imgDims.height || !imgDims.origWidth || !imgDims.origHeight) {
      console.log('Grid or image dimensions missing:', { grid, imgDims });
      return [0, 0];
    }
    // Map canvas pixel to original image pixel
    const imgX = (x / imgDims.width) * imgDims.origWidth;
    const imgY = (y / imgDims.height) * imgDims.origHeight;
    // Map original image pixel to grid index
    const gridRows = grid.length;
    const gridCols = grid[0].length;
    const gridX = Math.floor((imgX / imgDims.origWidth) * gridCols);
    const gridY = Math.floor((imgY / imgDims.origHeight) * gridRows);
    // Clamp to valid indices
    const mapped = [
      Math.max(0, Math.min(gridRows - 1, gridY)),
      Math.max(0, Math.min(gridCols - 1, gridX))
    ];
    console.log('Click:', { x, y }, 'Display size:', imgDims.width, imgDims.height, 'Orig size:', imgDims.origWidth, imgDims.origHeight, 'Grid size:', gridRows, gridCols, 'Mapped:', mapped);
    return mapped;
  };

  const handleCanvasClick = (e) => {
    if (!imgDims.width || !grid) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const [y, x] = mapToGrid(px, py);
    // Prevent duplicate points
    if (
      starts.some(([sy, sx]) => sy === y && sx === x) ||
      ends.some(([ey, ex]) => ey === y && ex === x)
    ) {
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
    if (!imgDims.width || !grid) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const [y, x] = mapToGrid(px, py);
    // Prevent duplicate points
    if (starts.some(([sy, sx]) => sy === y && sx === x)) {
      setMessage("Point already placed here!");
      setTimeout(() => setMessage(""), 1200);
      return;
    }
    setEnds([[y, x]]);
  };

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            marginBottom: "10px",
            color: "#2c3e50",
            fontWeight: "bold",
          }}
        >
          Left Click: Place Start &nbsp;|&nbsp; Right Click: Place End
        </div>
        {message && (
          <div style={{ color: "#e74c3c", marginTop: "8px", fontWeight: "bold" }}>{message}</div>
        )}
        <div
          style={{
            width: imgDims.width,
            height: imgDims.height,
            position: "relative",
            margin: "0 auto",
            background: "#222",
            borderRadius: "6px",
            overflow: "hidden",
            display: imgDims.width ? "block" : "none",
          }}
        >
          {/* Maze image */}
          <img
            src={imageName ? `http://localhost:8000/images/${imageName}` : ""}
            alt="Maze"
            style={{
              width: imgDims.width,
              height: imgDims.height,
              display: "block",
              position: "absolute",
              left: 0,
              top: 0,
              zIndex: 1,
              userSelect: "none",
              pointerEvents: "none",
            }}
            draggable={false}
          />
          {/* Overlay canvas */}
          <canvas
            ref={canvasRef}
            width={imgDims.width}
            height={imgDims.height}
            onClick={handleCanvasClick}
            onContextMenu={handleCanvasContextMenu}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              zIndex: 2,
              width: imgDims.width,
              height: imgDims.height,
              cursor: "crosshair",
              background: "transparent",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MazeCanvas;
