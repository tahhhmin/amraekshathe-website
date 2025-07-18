import styles from "./page.module.css";
import HeroSection from "@/components/home/HeroSection";
import MapComponent from "@/components/home/MapSection";
import OrganisationSlideshow from "@/components/home/OrganisationSlideshow";
import HowItWorksSection from "@/components/home/HowItWorksSection";

export default function Home() {
    return (
        <div className={styles.page}>
            <HeroSection />
            <OrganisationSlideshow />
            <MapComponent />
            <HowItWorksSection />
        </div>
    );
}
