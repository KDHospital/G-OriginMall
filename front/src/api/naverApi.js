import axios from "axios";

const NAVER_CLIENT_ID = 'WnsZfckbLjR_r3kvvmOI'
const NAVER_REDIRECT_URI = `${import.meta.env.VITE_REDIRECT_URL}/oauth/naver`


//랜덤 문자열(state) 생성 함수
const generateRandomString = () => {
    return Math.random().toString(36).substring(2 , 15)
}
//호출할 때마다 새로운 URL을 생성하는 함수

export const getNaverAuthUrl = () => {
    const state = generateRandomString()

    return `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URI}&state=${state}`
}

//백엔드에 인가코드와 state전달
export const getNaverLoginMessage = async (code , state) => {
    const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/member/naver?code=${code}&state=${state}`,
        { withCredentials : true}
    )
    return response.data
}
