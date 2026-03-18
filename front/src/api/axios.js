import axios from "axios"

//hj_서버주소만 관리하는 api
export const API_SERVER_HOST = 'http://localhost:8080';

const host = axios.create({
    baseURL: API_SERVER_HOST
});

export default host;