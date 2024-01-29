import axios from 'axios';
import { useState, useEffect} from 'react';

const useFetchImages = (url, options = {}) => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImagesData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(url, { responseType: 'arraybuffer', ...options });
        const imageDataList = response.data;
        console.log(imageDataList);
        const newImages = [];
        imageDataList.map((imageData) => {
          const image = {
            url: URL.createObjectURL(new Blob([imageDataList], { type: 'image/jpeg' })),
          }
          newImages.push(image);
        });
        setImages(newImages);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImagesData();
  }, [url]);

  const revokeImageUrls = () => {
    images.forEach((image) => URL.revokeObjectURL(image.url));
  };

  // Cleanup function to avoid memory leaks
  useEffect(() => () => revokeImageUrls(), [images]);
  return { images, isLoading, error, revokeImageUrls };
};

export default useFetchImages;
