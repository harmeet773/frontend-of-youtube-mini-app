import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import GoogleLogin from './auth/GoogleLogin';
import OAuthSuccess from './auth/OAuthSuccess';
import Navbar from './components/Navbar';

import './App.css';

import HarmeetsYoutube from './Youtube/HarmeetsYoutube'
import VideoPage from './Youtube/YoutubeComponents/VideoPage'
import CheckBackendConnectivity from './CheckBackendConnectivity'
import RouteTracker from './components/RouteTracker';
import About from './components/About';
function App() {

  const [BackendStatus, setBackendStatus] = useState(false);
  return (
    <>
      <Navbar />
      <RouteTracker />
      <CheckBackendConnectivity   BackendStatus={BackendStatus}  setBackendStatus={setBackendStatus}   />
      {BackendStatus   &&
      <Routes>
        <Route path="/" element={<HarmeetsYoutube />} />
        <Route path="/video/:videoId" element={<VideoPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/auth" element={   <GoogleLogin /> } />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
      </Routes>        }

    </>
  )
}

export default App
