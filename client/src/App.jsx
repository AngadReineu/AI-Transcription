import { Route, Routes } from "react-router-dom"
import UserLayout from "./components/Layout/UserLayout"
import Home from "./pages/Home"
import Hero from "./components/Layout/Hero"
import TranscriptionPage from "./pages/TranscriptionPage"
import YouTubeTranscriptionPage from "./pages/YoutubeLink"
import LiveTranscriptionPage from "./pages/LiveTranscription"
import AllFeature from "./pages/AllFeature"



function App() {

  return (
    <Routes>
      {/* user layout */}
      <Route path="/" element={<UserLayout/>}>
      <Route index element={<Home/>} />
      <Route path="/video-transcription" element={<TranscriptionPage/>} />
      <Route path="/youtube" element={<YouTubeTranscriptionPage />} />
      <Route path="/live" element={<LiveTranscriptionPage />} />
      <Route path="/all-feature" element={<AllFeature />} />
     

      </Route>
    </Routes>
  )
}

export default App
