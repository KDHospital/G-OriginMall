import { useEffect } from "react"
import host from "./api/axios";

function App() {

  useEffect(()=>{
    //테스트코드 작성 백엔드 API 호출 테스트
    // fetch('http://localhost:8080/api/test')
    // .then(response => response.json())
    // .then(data=>console.log("CORS 성공:",data))
    // .catch(error => console.error("CORS 실패:",error));

        host.get('/api/test')
        .then(res => console.log("Axios로 CORS 성공:", res.data))
        .catch(err => console.error("Axios로 CORS 실패:", err));

  },[]);
  
  return (
    <>
      <h1 className="text-3xl font-bold underline">안녕 리액트!!!</h1>
    </>
  )
}

export default App