import axios from "axios";

const REST_API_KEY =`68cff17719b3c43572507fea2c172298`
const REDIRECT_URI = `${import.meta.env.VITE_REDIRECT_URL}/oauth/kakao`

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`

// 백에서 넘어오는 인가 코드를 전달하는 함수
export const getKakaoLoginMessage = async (code) => {
    const response = await axios.get(`${import.meta.env.VITE_REDIRECT_URL}/api/member/kakao?code=${code}`,{
        withCredentials: true
})
   
    return response.data
}