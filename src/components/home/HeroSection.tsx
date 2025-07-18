import React from 'react';
import Styles from './HeroSection.module.css';
import Button from '@/ui/button/Button';
import VerticalDivider from '@/ui/dividers/VerticalDivider';

export default function HeroSection() {
  return (
    <section className={Styles.section}>
      <div className={Styles.container}>
        <div className={Styles.heroTag}>
          <p>An Initiative By ...</p>
        </div>

        <div>
          <h1 className="hero-text">Connect Volunteers with</h1>
          <h1 className="hero-text highlight-hero-text">Meaningful Causes</h1>
        </div>

        <div>
          <h2 className={Styles.subtitle}>
            Join our platform to discover volunteer
            opportunities near you or showcase your
            organization&apos;s projects to passionate
            volunteers ready to make a difference.
          </h2>
        </div>

        <div className={Styles.buttonContainer}>
          <Button
            variant="primary"
            label="I&apos;m a Volunteer"
          />
          <Button
            variant="outlined"
            label="I&apos;m an Organisation"
          />
        </div>

        <div className={Styles.infocontainer}>
          <div className={Styles.infoContainer}>
            <h2 className={Styles.cardSubtitle}>Organisations</h2>
            <h1 className="hero-text">124</h1>
          </div>
          <VerticalDivider />
          <div className={Styles.infoContainer}>
            <h2 className={Styles.cardSubtitle}>Volunteers</h2>
            <h1 className="hero-text">1400</h1>
          </div>
          <VerticalDivider />
          <div className={Styles.infoContainer}>
            <h2 className={Styles.cardSubtitle}>Projects</h2>
            <h1 className="hero-text">560</h1>
          </div>
        </div>
      </div>
    </section>
  );
}
