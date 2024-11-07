import React, { useRef, useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';

const CamInputPageTest = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageData, setImageData] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [loading, setLoading] = useState(false);
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing the camera", error);
    }
  };
  
  useEffect(() => {
    // Request permission and start the video stream when the component mounts
    startCamera();
  }, []);

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    console.log('str ', stream)
    if (stream) {
      console.log("Stopping stream:", stream);
        const tracks = stream.getTracks();
        console.log("Tracks to stop:", tracks);
        tracks.forEach(track => {
            track.stop();
            console.log(`Stopped track: ${track.kind}`);
        });
        videoRef.current.srcObject = null;
        console.log('Camera stopped');
    } else {
          console.warn("No active stream to stop.");
      }
};

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video stream
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the image data URL and set it to state
    setImageData(canvas.toDataURL('image/png'));
    return canvas.toDataURL('image/png');
  };

  // Process the captured image with Tesseract.js
  const handleScan = async (e) => {
    e.preventDefault()
    setLoading(true);
      const image = captureImage()
      try {
          const { data: { text } } = await Tesseract.recognize(image, 'eng', {
              logger: (m) => console.log(m),
          });
          setOcrText(text);
          console.log(text)
          stopCamera()
      } catch (err) {
          console.error('OCR processing failed', err);
      } finally {
        setLoading(false);
    }
  };
  const handleCancel = (e) => {
    e.preventDefault()
    stopCamera()
    // nav('/')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-xl font-semibold text-center mb-4">Capture Document</h2>

         <div className="relative w-full h-64 bg-gray-200 overflow-hidden rounded-lg">
          <video
            ref={videoRef}
            autoPlay
            className="w-full h-full object-cover"
            playsInline
          ></video>
          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>

        <button
          onClick={handleScan}
          className="mt-4 w-1/2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Capture Photo
        </button>

        <button
          onClick={handleCancel}
          className="mt-4 w-1/2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Stop
        </button>
        

        {imageData && (
          <div className="mt-4">
            <h3 className="text-center text-lg font-semibold">Captured Image:</h3>
            <img src={imageData} alt="Captured document" className="mt-2 w-full rounded-md border" />
            <a
              href={imageData}
              download="document.png"
              className="block text-center mt-2 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
            >
              Save Image
            </a>
          </div>
        )}
                  {loading && <p>Processing...</p>}
                  {ocrText && <pre className="bg-gray-100 text-gray-700 p-4 rounded-md shadow-md mt-4 max-w-md mx-auto">{ocrText}</pre>}
      </div>
    </div>
  );
};

export default CamInputPageTest;