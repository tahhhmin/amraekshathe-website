import React from 'react'
import Styles from './page.module.css'

export default function page() {
    return (
        <section className={Styles.section}>
            <div className={Styles.container}>
                <div className={Styles.header}>

                    <div className={Styles.profileIdentity}>
                        <div className={Styles.profileImage}></div>

                        <div className={Styles.profileIdentityText}>
                            <h1>Organisation Name</h1>
                            <h2>Other Info</h2>
                        </div>
                    </div>

                    <div className={Styles.profileInformation}>
                        <div className={Styles.statContainer}>
                            <p className="muted-text">Active Projects</p>
                            <h1 className={Styles.titleHoursVol}>8</h1>
                            <p className="muted-text">Currently running</p>
                        </div>

                        <div className={Styles.statContainer}>
                            <p className="muted-text">Applications</p>
                            <h1 className={Styles.titleProjectsJoined}>15</h1> 
                            <p className="muted-text">Pending review</p>
                        </div>
                    </div>



                </div>

                <div className={Styles.profileContent}>
                    <div className={Styles.content}>
                        {/* all other info */}
                    </div>

                    <div className={Styles.contentInformation}>
                        {/* show projects */}
                    </div>
                </div>
            </div>
        </section>

    )
}