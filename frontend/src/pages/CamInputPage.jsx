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
 const ocrTextRef = useRef(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia( {video: { facingMode: { ideal: "environment" } } // Request rear camera
      }); //{ video: true });

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

  useEffect(() => {
    if (ocrText && ocrTextRef.current) {
     ocrTextRef.current.scrollIntoView({
      behaviour: "smooth",
      block: "center"
    }) 
    }

  }, [ocrText])

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
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video stream
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    // Draw video frame to the canvas
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

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
          const { data: { text } } = await Tesseract.recognize(image, 'eng+deu', {
              logger: (m) => console.log(m),
          });
          setOcrText(text);
          // stopCamera()
      } catch (err) {
          console.error('OCR processing failed', err);
      } finally {
          setLoading(false);
      }
  };

  const handleCancel = (e) => {
    e.preventDefault()
    stopCamera()
    nav('/home')
  }

  const handleReset = (e) => {
    e.preventDefault()
    setImageData(null)
    setOcrText("")
    startCamera()
  }

  const handleContinue = (e) => {
    e.preventDefault()
    stopCamera()
    nav('/new-transaction', {state: {scannedTxt: ocrText} })
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
    <div className="relative w-full max-w-md bg-white rounded-lg p-4">
      <h2 className="text-xl font-semibold text-center mb-4">Scan Receipt</h2>

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
      {!imageData && <button onClick={handleCancel} className="btn btn-lg btn-accent text-white w-1/2 max-w-lg py-4
                            font-semibold bg-custom2 rounded-lg border-gray-300
                            hover:bg-opacity-90 hover:border-opacity-100 hover:border-custom2 hover:bg-custom2">Return</button>}

      <button
        onClick={handleScan}
        className="btn btn-lg bg-custom3 text-white w-1/2 rounded-lg border-gray-300
        hover:bg-opacity-90 hover:border-opacity-100 hover:border-custom3 hover:bg-custom3"
      >
        Scan Image
      </button></div>
      
  

      {imageData && (
        <>
        <div className="mt-4 relative w-full h-64 bg-gray-200 rounded-lg">
          <img src={imageData} alt="Captured document" className="mt-2 w-full rounded-md border w-full h-full object-cover" />
        </div>
          <div className="flex flex-row w-full justify-center pt-2 p-1 space-x-1 ">
            <button className="btn btn-info bg-custom2 text-white w-1/3 rounded-lg border-gray-300
          hover:bg-opacity-90 hover:border-opacity-100 hover:border-custom2 hover:bg-custom2"
                    onClick={handleCancel}>
              Cancel
            </button>
            <button className="btn btn-secondary bg-custom3 text-white w-1/3 rounded-lg
        hover:bg-opacity-90 hover:border-opacity-100 hover:border-custom3 hover:bg-custom3"
                    onClick={handleReset}>
              Reset
            </button>
            {ocrText && <button className="btn btn-accent bg-blue-600 text-white w-1/3 rounded-lg border-gray-300
          hover:bg-opacity-90 hover:border-opacity-100 hover:border-blue-600 hover:bg-blue-600"
                                onClick={handleContinue}>
            Submit
          </button>}
          </div>
        </>
      )}
      {/* <div className='relative w-full max-w-md '> */}
      {loading &&
          <p className="bg-gray-100 text-gray-700 p-4 rounded-md shadow-md mt-4 max-w-md mx-auto">Processing...</p>}
      {ocrText && <pre ref={ocrTextRef} className="bg-gray-100 text-gray-700 p-4 rounded-md shadow-md mt-4 max-w-md mx-auto sm:text-xs">{ocrText}</pre>}
         {/* </div> */}
    </div>
  </div>
  );
};

export default CamInputPage;