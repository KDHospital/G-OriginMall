import { Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";


const ProtectedRoute = ({children,allowRole}) => {

    const userInfo = JSON.parse(localStorage.getItem("member"))
    const [shouldRedirect, setShouldRedirect] = useState(false)
    const [redirectPath,setRedirectPath] = useState("")
    const [isVerified, setIsVerified] = useState(false)
    const hasAlerted = useRef(false)

useEffect(() =>{
    if(hasAlerted.current) return
    
    if(!userInfo) {
        setTimeout(() => {
              hasAlerted.current = true
        alert("로그인이 필요한 서비스입니다.")
        setRedirectPath("/login")
        setShouldRedirect(true)
        }, 500);
      
        
        
    }else if(allowRole !== undefined && userInfo.role != allowRole) {
        setTimeout(() => {
            hasAlerted.current = true
        alert("접근 권한이 없습니다.")
        setRedirectPath("/")
        setShouldRedirect(true)
        }, 500);
        
    } else{
        setIsVerified(true)
    }
},[userInfo,allowRole])

if(shouldRedirect) {
    return <Navigate to={redirectPath} replace />
}

if(!userInfo && !shouldRedirect) return null

if(allowRole !== undefined && userInfo?.role != allowRole && shouldRedirect) return null

if(!isVerified){
    return  null
}
    return children
}
export default ProtectedRoute
