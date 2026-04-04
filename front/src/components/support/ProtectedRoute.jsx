import { Navigate } from "react-router-dom";


const ProtectedRoute = ({children,allowRole}) => {

    const useInfo = JSON.parse(localStorage.getItem("member"))

    if(!useInfo) {
        alert("로그인이 필요한 서비스입니다.")
        return <Navigate to={"/login"} replace />
    }

    if(allowRole !== undefined && useInfo.role != allowRole) {
        alert("접근 권한이 없습니다.")
        return <Navigate to={"/"} replace />
    }
    
    return children
}
export default ProtectedRoute
