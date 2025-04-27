import React, { useState } from "react";
import ImageSelector from "./components/ImageSelector";
import MazeCanvas from "./components/MazeCanvas";
import Controls from "./components/Controls";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [grid, setGrid] = useState([]);
  const [starts, setStarts] = useState([]);
  const [ends, setEnds] = useState([]);
  const [path, setPath] = useState([]);
  const [placingMode, setPlacingMode] = useState("start"); // 'start' or 'end'

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
        
        <ImageSelector setSelectedImage={setSelectedImage} setGrid={setGrid} onImageChange={handleImageChange} />
        
        {grid.length > 0 && (
          <>
            <Controls
              starts={starts}
              ends={ends}
              setStarts={setStarts}
              setEnds={setEnds}
              grid={grid}
              setPath={setPath}
            />
            <MazeCanvas
              grid={grid}
              starts={starts}
              ends={ends}
              setStarts={setStarts}
              setEnds={setEnds}
              path={path}
              placingMode={placingMode}
              setPlacingMode={setPlacingMode}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
