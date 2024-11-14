import { useEffect, useRef, useState } from "react";
import Markdown from 'react-markdown'
import {  Camera, Microphone, PencilSimpleLine, PencilSimple,  } from 'phosphor-react';

import useApiRequest from "../hooks/useAPI";
import AudioInputComponent from "./AudioInputComponent";
import LoadingSwirl from "./LoadingSwirlAnimation";

export default function AskInsightComponent() {
    const { sendRequest, data, error, loading } = useApiRequest({ auth: true });
    const [insightFocus, setInsightFocus] = useState(false)
    const [inputValue, setInputValue] = useState("");
    const [insightResp, setInsightResp] = useState("")
    const [audioMode, setAudioMode] = useState(false)

    const insightBoxRef = useRef(null)
    const respBoxRef = useRef(null)
    const cancelBtnRef = useRef(null)
    const submitBtnRef = useRef(null)


    useEffect(() => {
      if (insightResp && respBoxRef.current) {
       respBoxRef.current.scrollIntoView({
        behaviour: "smooth",
        // block: "center"
      }) 
      }

    }, [insightResp])

    useEffect(() => {
        if (data && !error) {
          console.log(data.content)
          setInsightResp(data.content)
        }
      }, [data, error])

      const handleFocusInsightClick = (e) => {
        e.preventDefault()
        if (cancelBtnRef.current && cancelBtnRef.current.contains(e.target)) {
          // cancel insight container
          setInsightFocus(false)
        } else if (submitBtnRef.current && submitBtnRef.current.contains(e.target)) {
          // *** send user ask request
          try {
            sendRequest('POST', '/transactions/get-ask-insight/', {"user_context": inputValue})
          } catch (error) {
            console.log(error)
          }
        } else {
          // set insight container focus
          setInsightFocus(true)
        }
      }

      useEffect(() => {
        if (insightFocus && insightBoxRef.current) {
          insightBoxRef.current.scrollIntoView({
            behaviour: "smooth",
            block: "center"
          })
        }

        if (insightFocus && !insightResp) {
          document.addEventListener("mousedown", handleClickOutside);
        } else {
          document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [insightFocus]);

    
      const handleClickOutside = (event) => {
        if (insightBoxRef.current && !insightBoxRef.current.contains(event.target)) {
          setInsightFocus(false);
        }
      };

      const handleClear = (e) => {
        e.preventDefault()
        setInsightResp("")
      }

      const iconSize = 22


    return (
        <>
              {/* Ask for Insights */}
      <div
          ref={insightBoxRef}
          className={`w-full max-w-lg p-4 font-semibold shadow-md bg-custom3 border border-gray-300 rounded-lg transition-all duration-300 ease-in-out ${
            insightFocus ? "py-6" : "cursor-pointer"
          }`}
          onClick={handleFocusInsightClick}
        >
          <div className="text-white rounded-lg text-center
          hover:bg-opacity-90 hover:border-opacity-100 hover:border-custom3 hover:bg-custom3">Ask for Insights</div>
          {/* TODO move input field above, ask for insights instead of submit btn; audio orb above with option to write text below */}
          
          {insightFocus && (
            <div className="flex flex-col gap-4 mt-4 space-y-2 ">

            {audioMode && <div className="flex flex-col justify-center">

              <button 
              onClick={() => setAudioMode(false)}
              className="btn btn-accent btn-circle text-white self-end mx-2">
               <PencilSimpleLine size={iconSize}/>
              </button>

              <AudioInputComponent focus={insightFocus} sendRequest={sendRequest} updateInputValue={setInputValue} updateInsightFocus={setInsightFocus}/>
            </div>}

           {!audioMode && <> <div className="flex flex-row gap-2">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                type="text"
                className="w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Type your question here..."
              />

              <button 
              onClick={() => setAudioMode(true)}
              className="btn btn-accent btn-circle text-white font-semibold ">
                <Microphone size={iconSize}/>
              </button>

            </div>

              <div className="flex justify-end">
                <button
                  ref={cancelBtnRef}
                  className="bg-orange-300 font-semibold py-2 px-4 rounded-lg text-gray-800 hover:bg-opacity-90 hover:border-opacity-100 hover:border-orange-400 hover:bg-orange-400"
                >
                  Cancel
                </button>


                <button
                  ref={submitBtnRef}
                  disabled={!inputValue.trim()}
         
                  className={`py-2 px-4 font-semibold rounded-lg ml-2 ${
                    inputValue.trim()
                      ? "bg-blue-300 text-gray-800 hover:bg-opacity-90 hover:border-opacity-100 hover:border-blue-400 hover:bg-blue-400"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Submit
                </button>
              </div>
              </>
              }
          
          {loading && <LoadingSwirl/>} 

              {!loading && insightResp && (
                <div className="mt-8 p-4 border rounded-lg shadow-sm">
                  <h3 
                  ref={respBoxRef}
                  className="text-lg font-semibold text-gray-300 mb-2">Response:</h3>
                  {/* <p className="text-gray-300 leading-relaxed">
                    {insightResp}
                  </p> */}
                  <Markdown className="text-gray-300 leading-relaxed">{insightResp}</Markdown>

                  <div className="flex flex-row justify-end gap-2 mt-4">
                    <button className="btn btn-warning" >share</button>
                    <button 
                    onClick={handleClear}
                    className="btn btn-secondary">clear</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        </>
    )
}