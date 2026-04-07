import { useParams } from "react-router-dom"
import BasicLayout from "../../layouts/BasicLayout"
import CertifiedDetailComponents from "../../components/products/CertifiedDetailComponents"

const CertifiedDetailPage = () =>{
    const {productId} = useParams()
    return(
        <BasicLayout>
            {/* CertifiedDetailComponent 삽입 */}
            <CertifiedDetailComponents productId={productId} />
        </BasicLayout>
    )
}
export default CertifiedDetailPage