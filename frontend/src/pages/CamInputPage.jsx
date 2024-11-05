import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';


const CamInputPage = () => {
  const nav = useNavigate()
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageData, setImageData] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [loading, setLoading] = useState(false);
 

  const startCamera = async () => {
    stopCamera()
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing the camera", error);
    }
  };

  // Access the camera
  useEffect(() => {
    // Request permission and start the video stream when the component mounts
    startCamera()
   
    return () => {
      stopCamera()
    }
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

  // Capture an image from the camera feed
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

  // const captureImage = () => {
  //     const canvas = canvasRef.current;
  //     const context = canvas.getContext('2d');
  //     context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
  //     return canvas.toDataURL('image/png');
  // };

  // Process the captured image with Tesseract.js
  const handleScan = async () => {
      setLoading(true);
      const image = captureImage()
      try {
          const { data: { text } } = await Tesseract.recognize(image, 'eng', {
              logger: (m) => console.log(m),
          });
          setOcrText(text);
      } catch (err) {
          console.error('OCR processing failed', err);
      } finally {
          setLoading(false);
      }
  };

  const handleCancel = (e) => {
    e.preventDefault()
    stopCamera()
    nav('/')
  }

  const handleReset = (e) => {
    e.preventDefault()
    setImageData(null)
    setOcrText("")
    startCamera()
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-semibold text-center mb-4">Scan Receipt</h2>

      { !imageData && <div>
      <div className="relative w-full h-64 bg-gray-200 overflow-hidden rounded-lg">
        <video
          ref={videoRef}
          autoPlay
          className="w-full h-full object-cover"
          playsInline
        ></video>
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
      <div className="flex flex-row w-full justify-center pt-2 p-1 space-x-1 "> 


      <button onClick={handleCancel} className="btn btn-warning w-24 rounded-lg">Cancel</button>

      <button
        onClick={handleScan}
        className="btn btn-accent w-40 rounded-lg"
      >
        Scan Image
      </button></div></div>}
      
  

      {imageData && (
        <div className="mt-4">
          {/* <h3 className="text-center text-lg font-semibold">Captured Image:</h3> */}
          <img src={imageData} alt="Captured document" className="mt-2 w-full rounded-md border" />
          <div className="flex flex-row w-full justify-center pt-2 p-1 space-x-1 ">
          <button onClick={handleCancel} className="btn btn-warning w-24 rounded-lg">Cancel</button>
          <button onClick={handleReset} className="btn btn-secondary w-24 rounded-lg">Reset</button>
          <button className="btn btn-accent w-24 rounded-lg">Continue</button>
          </div>
          {/* <a
            href={imageData}
            download="document.png"
            className="block text-center mt-2 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
          >
            Save Image
          </a> */}
        </div>
      )}
          {loading && <p>Processing...</p>}
         {ocrText && <pre className="bg-gray-100 text-gray-700 p-4 rounded-md shadow-md mt-4 max-w-md mx-auto">{ocrText}</pre>}
    </div>
  </div>
  );
};

export default CamInputPage;