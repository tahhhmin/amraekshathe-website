import React from 'react'
import Styles from './InfoSection.module.css'
import { MapPin, Users, Calendar } from 'lucide-react'

export default function InfoSection() {
    return (
        <section className={Styles.section}>
            <h1>How Amra Ekshathe Works</h1>
            <div className={Styles.container}>
                <div className={Styles.infoCardContainer}>
                    <div className={Styles.cardHeader}>
                        <MapPin className={Styles.icon} size={64}/>
                        <h1>Location-Based Matching</h1>
                    </div>
                    <div className={Styles.cardContent}>
                        <p>Find volunteer opportunities and organizations near you based on your location preferences.</p>
                    </div>
                </div>
                <div className={Styles.infoCardContainer}>
                    <div className={Styles.cardHeader}>
                        <Users className={Styles.icon} size={64}/>
                        <h1>Connect & Collaborate</h1>
                    </div>
                    <div className={Styles.cardContent}>
                        <p>Find volunteer opportunities and organizations near you based on your location preferences.</p>
                    </div>
                </div>
                <div className={Styles.infoCardContainer}>
                    <div className={Styles.cardHeader}>
                        <Calendar className={Styles.icon} size={64}/>
                        <h1>Manage Projects</h1>
                    </div>
                    <div className={Styles.cardContent}>
                        <p>Find volunteer opportunities and organizations near you based on your location preferences.</p>
                    </div>
                </div>
                <div className={Styles.infoCardContainer}>
                    <div className={Styles.cardHeader}>
                        <MapPin className={Styles.icon} size={64}/>
                        <h1>Location-Based Matching</h1>
                    </div>
                    <div className={Styles.cardContent}>
                        <p>Find volunteer opportunities and organizations near you based on your location preferences.</p>
                    </div>
                </div>
                <div className={Styles.infoCardContainer}>
                    <div className={Styles.cardHeader}>
                        <MapPin className={Styles.icon} size={64}/>
                        <h1>Location-Based Matching</h1>
                    </div>
                    <div className={Styles.cardContent}>
                        <p>Find volunteer opportunities and organizations near you based on your location preferences.</p>
                    </div>
                </div>
                <div className={Styles.infoCardContainer}>
                    <div className={Styles.cardHeader}>
                        <MapPin className={Styles.icon} size={64}/>
                        <h1>Location-Based Matching</h1>
                    </div>
                    <div className={Styles.cardContent}>
                        <p>Find volunteer opportunities and organizations near you based on your location preferences.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
