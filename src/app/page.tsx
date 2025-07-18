import styles from "./page.module.css";
import HeroSection from "@/components/home/HeroSection";
import OrganisationSlideshow from "@/components/home/OrganisationSlideshow";
import HowItWorksSection from "@/components/home/HowItWorksSection";

export default function Home() {
    return (
        <div className={styles.page}>
            <HeroSection />
            <OrganisationSlideshow />
            <HowItWorksSection />
        </div>
    );
}
