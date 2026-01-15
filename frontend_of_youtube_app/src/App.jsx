import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import './App.css';

import HarmeetsYoutube from './Youtube/HarmeetsYoutube'
import VideoPage from './Youtube/YoutubeComponents/VideoPage'
import CheckBackendConnectivity from './CheckBackendConnectivity'

function App() {
  const [count, setCount] = useState(0) 
  const [BackendStatus, setBackendStatus] = useState(false);
  return (         
    <>
      <CheckBackendConnectivity   BackendStatus={BackendStatus}  setBackendStatus={setBackendStatus}   />   
      {BackendStatus   &&  
      <Routes>
        <Route path="/" element={<HarmeetsYoutube />} />
        <Route path="/video/:videoId" element={<VideoPage />} />   
      </Routes>        }
      
    </>
  )
}

export default App
