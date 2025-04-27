import React, { useState } from "react";
import axios from "axios";

const Controls = ({ starts, ends, setStarts, setEnds, grid, setPath }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSolve = async () => {
    if (starts.length === 0 || ends.length === 0) {
      setError("Please place at least one start and one end point.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.post("http://localhost:8000/astar", {
        grid,
        starts,
        ends,
      });
      setPath(res.data.path || []);
      if (!res.data.path || res.data.path.length === 0) {
        setError("No path found between start and end points!");
      }
    } catch (err) {
      setError("Failed to find path. Please try again.");
      console.error("A* request failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPath = () => {
    setPath([]);
    setError(null);
  };

  const handleClearStarts = () => {
    setStarts([]);
    setPath([]);
    setError(null);
  };

  const handleClearEnds = () => {
    setEnds([]);
    setPath([]);
    setError(null);
  };

  const handleClearAll = () => {
    setStarts([]);
    setEnds([]);
    setPath([]);
    setError(null);
  };

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
        display: "inline-block",
        minWidth: "340px"
      }}>
        <div style={{ marginBottom: "10px", fontSize: "15px", color: "#2c3e50" }}>
          <span style={{ color: "#2ecc71", fontWeight: "bold" }}>● Start</span> &nbsp;|&nbsp;
          <span style={{ color: "#c0392b", fontWeight: "bold" }}>● End</span> &nbsp;|&nbsp;
          <span style={{ color: "#3498db", fontWeight: "bold" }}>● Path</span>
        </div>
        <div style={{ marginBottom: "10px", color: "#7f8c8d", fontSize: "13px" }}>
          Left Click: Place <span style={{ color: "#2ecc71" }}>start</span>, Right Click: Place <span style={{ color: "#c0392b" }}>end</span>.<br/>
          You can place multiple starts and ends.
        </div>
        <button
          onClick={handleSolve}
          disabled={isLoading}
          style={{
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            marginRight: "10px",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1,
            transition: "all 0.3s ease"
          }}
        >
          {isLoading ? "Finding Path..." : "Find Shortest Path"}
        </button>
        <button
          onClick={handleResetPath}
          style={{
            backgroundColor: "#e67e22",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            marginRight: "10px",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
        >
          Reset Path
        </button>
        <button
          onClick={handleClearStarts}
          style={{
            backgroundColor: "#2ecc71",
            color: "white",
            border: "none",
            padding: "8px 10px",
            borderRadius: "4px",
            marginRight: "5px",
            cursor: "pointer",
            fontSize: "13px"
          }}
        >
          Clear Starts
        </button>
        <button
          onClick={handleClearEnds}
          style={{
            backgroundColor: "#c0392b",
            color: "white",
            border: "none",
            padding: "8px 10px",
            borderRadius: "4px",
            marginRight: "5px",
            cursor: "pointer",
            fontSize: "13px"
          }}
        >
          Clear Ends
        </button>
        <button
          onClick={handleClearAll}
          style={{
            backgroundColor: "#7f8c8d",
            color: "white",
            border: "none",
            padding: "8px 10px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "13px"
          }}
        >
          Clear All
        </button>
        {error && (
          <div style={{
            color: "#e74c3c",
            marginTop: "10px",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Controls;
