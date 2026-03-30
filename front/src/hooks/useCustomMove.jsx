import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom"
import { useState } from "react"

const getNum =(param, defaultValue) =>{
    if (!param) {
        return defaultValue
    }
    return parseInt(param)
}
const useCustomMove = () => {
    const navigate = useNavigate();

    const [refresh, setRefresh] = useState(false);
    const [queryParams] = useSearchParams();
    // 1. URL에서 값들 꺼내기
    const page = getNum(queryParams.get('page'),1)
    const size = getNum(queryParams.get('size'),12)
    const categoryId = queryParams.get('categoryId')
    // 2. 기본 쿼리 스트링 생성
    const queryDefault = createSearchParams({page,size,...(categoryId&&{categoryId})}).toString()

    const moveToList = (pageParam) => {
        let queryStr ="";

        if (pageParam) {
            const pageNum = getNum(pageParam.page,1)
            const sizeNum = getNum(pageParam.size,12)

            queryStr = createSearchParams({page:pageNum,size:sizeNum,...(categoryId&&{categoryId})}).toString()
        } else{
            queryStr = queryDefault
        }
        setRefresh(!refresh)

        navigate({
            pathname:`../products`,
            search: queryStr
        })
    }

    const moveToRead = (num) =>{
        console.log(queryDefault)

        navigate({
            pathname:`../products/${num}`,
            search: queryDefault
        })
    }

    const moveToCategory = (catId) => {
        const queryStr = createSearchParams({
            page: 1,
            size: 12,
            ...(catId && { categoryId: catId })
        }).toString()
        
        navigate({
            pathname: `/products`,
            search: queryStr
        })
    }
    return {moveToList,moveToRead,moveToCategory,page,size,refresh,categoryId}
}
export default useCustomMove