import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";


const ProtectedRoute = ({children,allowRole}) => {

    const useInfo = JSON.parse(localStorage.getItem("member"))
    const [redirect, setRedirect] = useState(null);

    useEffect(()=>{

        if(!useInfo) {
            setTimeout(()=>{
            alert("로그인이 필요한 서비스입니다.")
            setRedirect("/login");
            },500)
            
        }

        if(allowRole !== undefined && useInfo.role != allowRole) {
            setTimeout(()=>{
            alert("접근 권한이 없습니다.")
            setRedirect("/")

            },500)

        }
        
        

    }, []);

    if (redirect) return <Navigate to={redirect} replace />;
    if (!useInfo) return null;
    if (allowRole !== undefined && useInfo.role != allowRole) return null;

    return children;
    
}
export default ProtectedRoute
