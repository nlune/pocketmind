
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import AnimatedGlowingOrb from '../components/AudioAnimation';

const AudioInputComponent = ({sendRequest, updateInputValue, updateInsightFocus}) => {
  const nav = useNavigate();
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  const transcriptRef = useRef(null)
  const orbRef = useRef(null)

  useEffect(() => {
      if (orbRef.current){
       orbRef.current.scrollIntoView({
        behaviour: "smooth",
        block: "center"
      }) 
      }
  }, [])

  useEffect(() => {
    if (transcript) {
      updateInputValue(transcript)
      if (transcriptRef.current) {
        transcriptRef.current.scrollIntoView({
          behaviour: "smooth",
          // block: "center"
        })
      }
    }
  }, [transcript])

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
    try {
        sendRequest('POST', '/transactions/get-ask-insight/', {"user_context": transcript})
      } catch (error) {
        console.log(error)
      }
    
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

      <AnimatedGlowingOrb isRecording={listening}/>

      <p ref={orbRef} className="text-gray-200">{listening ? "Listening..." : "Microphone Off"}</p>

      <div className="flex flex-row gap-1 justify-center">
        {listening ? (
          <button className="btn btn-warning bg-red-600 text-white w-1/3 rounded-lg
          hover:bg-opacity-90 hover:border-opacity-90 hover:border-red-600 hover:bg-red-600"
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

        <button className="btn btn-secondary  text-white w-1/3 rounded-lg
        hover:bg-opacity-90 hover:border-opacity-100"
                onClick={resetTranscript}>
          Reset
        </button>


          <button 
          disabled={!transcript}
          className={`text-sm p-3 rounded-lg  w-1/3 ${
            transcript
              ? "bg-blue-600 text-white hover:bg-opacity-90 hover:border-opacity-100 hover:border-blue-400 hover:bg-blue-400"
              : "bg-gray-300 text-gray-400 cursor-not-allowed"
          }`}
        //   className="btn btn-accent bg-blue-600 text-white w-1/3 rounded-lg"
                  onClick={handleContinue}>
            Submit
          </button>

      </div>

      {transcript && (
        <div 
        ref={transcriptRef}
        className="transcript-container bg-base-200 p-4 rounded-lg shadow-md w-full max-w-md mt-8 overflow-y-auto">
          <p className="text-sm text-gray-500 whitespace-pre-wrap break-words">
            {transcript}
          </p>
        </div>
      )}
    </div>
);
};

export default AudioInputComponent;

