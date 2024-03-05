import axios from 'axios';

import styles from './UploadButton.module.css'

function UploadButton() {

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    handleSubmit(selectedFile)
  };

  const handleSubmit = async (selectedFile) => {
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
      <div className={styles["upload-button"]}>
        <input type="file" id="video" onChange={handleFileChange} />
        <label htmlFor="file">Upload a video</label>
      </div>
   
  );
}

export default UploadButton;