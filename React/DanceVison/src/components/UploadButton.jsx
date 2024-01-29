import React, { useState } from 'react';
import axios from 'axios';

function UploadButton() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("video", selectedFile);

    const axios1 = axios.create({
        baseURL: 'http://localhost:8000'
    });

    try {
      const response = await axios1.post('/upload-video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" name="video" onChange={handleFileChange} />
      <button type="submit">Upload a video</button>
    </form>
  );
}

export default UploadButton;