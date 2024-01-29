import React from "react";
import useFetchImages from "../hooks/useFetchImages";

function SelectVideoPage() {
    const { images, isLoading, error } = useFetchImages('http://localhost:8000/thumbnails');

    if (isLoading) {
      return <p>Loading images...</p>;
    }
  
    if (error) {
      return <p>Error fetching images: {error.message}</p>;
    }

    return (
      <div>
        {images.map((image, index) => (
          <img key={index} src={image.url} alt={`Image ${index + 1}`} />
        ))}
      </div>
    );
}


export default SelectVideoPage;