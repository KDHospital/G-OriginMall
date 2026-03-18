import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from "react"
import axiosInstance from "./api/axios";
import MainPage from './pages/main/MainPage';

function App() {

  useEffect(()=>{

        axiosInstance.get('/test')
        .then((res) => console.log("Axios로 CORS :", res.data))
        .catch((err) => console.error("Axios로 CORS :", err));

  },[]);
  
  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 */}
          <Route path="/" element={<MainPage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App