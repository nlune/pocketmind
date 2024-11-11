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
    <div className="flex flex-col gap-4 items-center">
      <h2 className="text-lg font-semibold text-gray-600 mb-2">
        Describe your latest expense
      </h2>
      <AnimatedGlowingOrb isRecording={listening} />
      <div className="flex flex-row gap-1 justify-center">
        {!listening && <button className="btn btn-success" onClick={() => SpeechRecognition.startListening({ continuous: true })}>Start</button>}
        <button className="btn btn-warning" onClick={SpeechRecognition.stopListening}>Stop</button>
        <button className="btn btn-secondary" onClick={resetTranscript}>Reset</button>
        {!transcript && <button className="btn btn-info" onClick={handleCancel}>Cancel</button>}
        {transcript && <button className="btn btn-accent" onClick={handleContinue}>Continue</button>}
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

