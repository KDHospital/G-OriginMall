import BasicLayout from "../../layouts/BasicLayout"
import ExhibitionDetailComponents from "../../components/products/ExhibitionDetailComponents"
import { useParams } from "react-router-dom"
const ExhibitionDetailPage = () => {

    const {productId} = useParams()

    return(
        <BasicLayout>
            <ExhibitionDetailComponents productId={productId} />
        </BasicLayout>
    )
}
export default ExhibitionDetailPage