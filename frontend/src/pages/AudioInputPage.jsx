import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const AudioInputPage = () => {
  const nav = useNavigate()
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable
      } = useSpeechRecognition();

      if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
      }

      if (!isMicrophoneAvailable) {
        // Render some fallback content
        return <span>Microphone is not available.</span>;
      }

      useEffect(() => {
        SpeechRecognition.startListening({ continuous: true })
      }, [])

      const handleContinue = () => {
        nav('/new-transaction', {state: {userInput: transcript} })
      }
    
      return (
        <div className='flex flex-col gap-4'>
          <p>Microphone: {listening ? 'on' : 'off'}</p>
          <div className="flex flex-row gap-1 justify-center">
          {!listening && <button className='btn btn-success' onClick={() => SpeechRecognition.startListening({ continuous: true })}>Start</button>}
          <button className='btn btn-warning' onClick={SpeechRecognition.stopListening}>Stop</button>
          <button className='btn btn-secondary' onClick={resetTranscript}>Reset</button>
          <button className='btn btn-primary' onClick={handleContinue}>Continue</button>
          </div>
          <p>{transcript}</p>
        </div>
      );

};

export default AudioInputPage;
