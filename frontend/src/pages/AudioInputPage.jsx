import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import AnimatedGlowingOrb from '../components/AudioAnimation';

const AudioInputPage = () => {
  const nav = useNavigate();
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  useEffect(() => {
    if (isMicrophoneAvailable) {
      SpeechRecognition.startListening({ continuous: true });
    }
    return () => {
      if (isMicrophoneAvailable) {
        SpeechRecognition.stopListening();
      }
    };
  }, [isMicrophoneAvailable]);

  const handleContinue = (e) => {
    e.preventDefault();
    SpeechRecognition.stopListening();
    nav('/new-transaction', { state: { userInput: transcript } });
  };
  
  const handleCancel = (e) => {
    e.preventDefault();
    SpeechRecognition.stopListening();
    nav('/home');
  };

  // Conditionally render based on speech support and microphone availability
  if (!browserSupportsSpeechRecognition) {
    return (
      <span className="error-message">
        Unfortunately we don't support speech recognition in this browser yet.<br/><br/>
        Please try another browser (eg. chrome, safari...)
      </span>
    );
  }
  
  if (!isMicrophoneAvailable) {
    return (
      <div className="error-message">
        <span>
          Microphone is not available.<br/><br/>Please check your permissions.
        </span>
      </div>
    );
  }

return (
    <div className="flex flex-col gap-4 items-center mt-2">
      <h2 className="text-lg font-semibold mt-16 text-gray-600 mb-2">
        Describe your latest expense
      </h2>

      <AnimatedGlowingOrb isRecording={listening} />
      <p className="text-gray-600">{listening ? "Listening..." : "Microphone Off"}</p>
      <div className="flex flex-row gap-1 justify-center">
        {listening ? (
          <button className="btn btn-warning bg-red-600 text-white w-1/3 rounded-lg
          hover:bg-opacity-90 hover:border-opacity-100 hover:border-red-600 hover:bg-red-600"
                  onClick={SpeechRecognition.stopListening}>
            Stop
          </button>
        ) : (
          <button className="btn btn-success bg-green-500 text-white w-1/3 rounded-lg
          hover:bg-opacity-90 hover:border-opacity-100 hover:border-green-500 hover:bg-green-500"
                  onClick={() => SpeechRecognition.startListening({ continuous: true })}>
            Start
          </button>
        )}

        <button className="btn btn-secondary bg-custom3 text-white w-1/3 rounded-lg
        hover:bg-opacity-90 hover:border-opacity-100 hover:border-custom3 hover:bg-custom3"
                onClick={resetTranscript}>
          Reset
        </button>

        {!transcript ? (
          <button className="btn btn-info bg-custom2 text-white w-1/3 rounded-lg border-gray-300
          hover:bg-opacity-90 hover:border-opacity-100 hover:border-custom2 hover:bg-custom2"
                  onClick={handleCancel}>
            Return
          </button>
        ) : (
          <button className="btn btn-accent bg-blue-600 text-white w-1/3 rounded-lg border-gray-300
          hover:bg-opacity-90 hover:border-opacity-100 hover:border-blue-600 hover:bg-blue-600"
                  onClick={handleContinue}>
            Submit
          </button>
        )}
      </div>

      {transcript && (
        <div className="transcript-container bg-base-200 p-4 rounded-lg shadow-md w-full max-w-md mt-8 overflow-y-auto">
          <p className="text-sm text-gray-500 whitespace-pre-wrap break-words">
            {transcript}
          </p>
        </div>
      )}
    </div>
);
};

export default AudioInputPage;

