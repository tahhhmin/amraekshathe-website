import { Users, MapPin, Calendar, ExternalLink, Mail } from "lucide-react"
import styles from "./page.module.css"

export default function OrganizationProfile() {
  const org = {
    name: "Noble Group",
    status: "Active",
    coverColor: "#cbd5e1",
    avatarText: "NG",
    description:
      "Empowering communities through education, health, and relief programs across Bangladesh.",
    stats: {
      members: 42,
      location: "Dhaka, Bangladesh",
      founded: "2012",
    },
    contact: {
      website: "https://noblegroup.org",
      email: "contact@noblegroup.org",
    },
  }

  return (
    <main className={styles.page}>
      <header className={styles.cover}>
        <div
          className={styles.coverBackground}
          style={{ backgroundColor: org.coverColor }}
        />
        <div className={styles.avatar}>{org.avatarText}</div>
        <span className={styles.badge}>{org.status}</span>
      </header>

      <section className={styles.headerSection}>
        <h1 className={styles.orgName}>{org.name}</h1>
        <p className={styles.description}>{org.description}</p>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <Users className={styles.icon} />
            <span>{org.stats.members} members</span>
          </div>
          <div className={styles.statItem}>
            <MapPin className={styles.icon} />
            <span>{org.stats.location}</span>
          </div>
          <div className={styles.statItem}>
            <Calendar className={styles.icon} />
            <span>Founded {org.stats.founded}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.joinBtn}>Join Now</button>
          <a
            href={`mailto:${org.contact.email}`}
            className={styles.messageBtn}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Mail className={styles.actionIcon} />
            Message
          </a>
          <a
            href={org.contact.website}
            className={styles.websiteLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Website <ExternalLink className={styles.actionIcon} />
          </a>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Projects</h2>
        {/* Insert project list or cards here */}
        <p>No projects listed yet.</p>
      </section>

      <section className={styles.section}>
        <h2>Volunteers</h2>
        {/* Insert volunteers list here */}
        <p>No volunteers listed yet.</p>
      </section>

      <section className={styles.section}>
        <h2>Upcoming Events</h2>
        {/* Insert events list here */}
        <p>No upcoming events.</p>
      </section>
    </main>
  )
}
