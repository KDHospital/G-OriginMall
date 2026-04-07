import BasicLayout from "../../layouts/BasicLayout";
import MainBanner from "../../components/main/MainBanner";
import CategoryTabs from "../../components/main/CategoryTabs";
import PopularProductsCard from "../../components/main/PopularProductsCard";
import GeumbitnaruExclusive from "../../components/main/GeumbitnaruExclusive";
import EventCard from "../../components/main/EventCard";

function MainPage() {
    return (
        <BasicLayout>
            <MainBanner></MainBanner>
            <CategoryTabs></CategoryTabs>
            <EventCard></EventCard>
            <PopularProductsCard></PopularProductsCard>
            <GeumbitnaruExclusive></GeumbitnaruExclusive>
        </BasicLayout>
    )
}

export default MainPage;