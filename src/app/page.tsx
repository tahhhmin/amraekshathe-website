import styles from "./page.module.css";
import HeroSection from "@/components/home/HeroSection";
import InfoSection from "@/components/home/InfoSection";
import MapSection from "@/components/home/MapSection";
import SlideshowSection from "@/components/home/SlideshowSection";

export default function Home() {
    return (
        <div className={styles.page}>
            <HeroSection />
            <SlideshowSection />
            <MapSection />
            <InfoSection />
        </div>
    );
}
