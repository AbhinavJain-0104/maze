import React, { useEffect, useState } from "react";
import axios from "axios";

const ImageSelector = ({ setSelectedImage, onImageChange }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get("http://localhost:8000/images");
        setImages(res.data);
      } catch (err) {
        setError("Failed to load images. Please try again.");
        console.error("Failed to fetch images:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const handleSelect = (img) => {
    setSelected(img);
    setSelectedImage(img);
    if (onImageChange) onImageChange();
  };

  return (
    <div style={{
      marginBottom: "20px",
      textAlign: "center"
    }}>
      <div style={{
        backgroundColor: "#f8f9fa",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        display: "inline-block",
        minWidth: "320px"
      }}>
        <h4 style={{
          margin: "0 0 15px 0",
          color: "#2c3e50"
        }}>
          Select a Maze Image
        </h4>
        {loading ? (
          <div style={{ color: "#7f8c8d" }}>Loading...</div>
        ) : error ? (
          <div style={{ color: "#e74c3c" }}>{error}</div>
        ) : (
          <select
            onChange={(e) => handleSelect(e.target.value)}
            value={selected}
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              border: "1px solid #bdc3c7",
              backgroundColor: "white",
              width: "100%",
              cursor: "pointer",
              marginBottom: "10px"
            }}
          >
            <option value="">-- Choose Image --</option>
            {images.map((img, i) => (
              <option key={i} value={img}>
                {img}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default ImageSelector;
