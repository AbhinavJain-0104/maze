import React, { useState, useEffect } from "react";
import ImageSelector from "./components/ImageSelector";
import MazeCanvas from "./components/MazeCanvas";
import Controls from "./components/Controls";
import axios from "axios";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [starts, setStarts] = useState([]);
  const [ends, setEnds] = useState([]);
  const [path, setPath] = useState([]);
  const [placingMode, setPlacingMode] = useState("start"); // 'start' or 'end'
  const [grid, setGrid] = useState(null);
  const [gridError, setGridError] = useState(null);

  // Fetch grid when image changes
  useEffect(() => {
    if (!selectedImage) {
      setGrid(null);
      setGridError(null);
      return;
    }
    const fetchGrid = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/grid?img=${selectedImage}`);
        setGrid(res.data.grid);
        setGridError(null);
      } catch (err) {
        setGrid(null);
        setGridError("Failed to load maze grid.");
      }
    };
    fetchGrid();
  }, [selectedImage]);

  // Clear all points when a new image is selected
  const handleImageChange = () => {
    setStarts([]);
    setEnds([]);
    setPath([]);
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#ecf0f1",
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{
          textAlign: "center",
          color: "#2c3e50",
          marginBottom: "30px",
          fontSize: "2.5em"
        }}>
          Maze Solver
        </h1>
        
        <ImageSelector setSelectedImage={setSelectedImage} onImageChange={handleImageChange} />
        
        {selectedImage && (
          <>
            <MazeCanvas
              imageName={selectedImage}
              starts={starts}
              ends={ends}
              setStarts={setStarts}
              setEnds={setEnds}
              path={path}
              placingMode={placingMode}
              setPlacingMode={setPlacingMode}
              grid={grid}
            />
            <Controls
              starts={starts}
              ends={ends}
              setStarts={setStarts}
              setEnds={setEnds}
              grid={grid}
              setPath={setPath}
            />
            {gridError && <div style={{color: '#e74c3c', textAlign: 'center', marginTop: 10}}>{gridError}</div>}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
