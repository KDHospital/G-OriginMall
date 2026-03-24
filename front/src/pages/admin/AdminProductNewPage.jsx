import AdminLayout from "../../layouts/AdminLayout"
import ProductAddComponent from "../../components/admin/ProductAddComponent"

const AdminProductNewPage = () => {

    return(
        <AdminLayout>
            {/* 페이지 타이틀 */}
            <h2 className="text-lg font-bold text-gray-700 border-l-4 border-blue-500 pl-3 mb-5">
                상품 등록
            </h2>
            <ProductAddComponent></ProductAddComponent>

        </AdminLayout>
    )

}

export default AdminProductNewPage