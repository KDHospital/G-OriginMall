import BasicMenu from "../components/menus/BasicMenu"
import FooterMenu from "../components/menus/FooterMenu"

const BasicLayout = ({children}) => {
    return(
        <>
            <BasicMenu></BasicMenu>            
            <main>
                {children}
            </main>            
            <FooterMenu></FooterMenu>
        </>
    )
}
export default BasicLayout