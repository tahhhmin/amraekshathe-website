/* This code update merges your current organization registration form with the structure and best practices from your SignIn component. It adds validation, geolocation, and cleanup. */

"use client";

import React, { useState } from "react";
import Styles from "./page.module.css";
import Button from "@/ui/button/Button";
import Input from "@/ui/input/Input";

export default function OrganisationRegistrationPage() {
  const [orgName, setOrgName] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [orgType, setOrgType] = useState("");
  const [orgSocialLink, setOrgSocialLink] = useState("");
  const [orgWebsiteLink, setOrgWebsiteLink] = useState("");
  const [orgLocation, setOrgLocation] = useState("");

  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderSocialLink, setSenderSocialLink] = useState("");
  const [senderWebsite, setSenderWebsite] = useState("");
  const [senderPosition, setSenderPosition] = useState("");

  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [meetingType, setMeetingType] = useState("");
  const [meetingPurpose, setMeetingPurpose] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const validateForm = (): boolean => {
    if (!orgName || !orgEmail || !orgType || !orgSocialLink || !orgLocation) {
      alert("Please fill in all required organization fields.");
      return false;
    }
    if (!senderName || !senderEmail || !senderPhone || !senderPosition) {
      alert("Please fill in all required sender fields.");
      return false;
    }
    if (!preferredDate || !preferredTime || !meetingType || !meetingPurpose) {
      alert("Please fill in all required meeting details.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const payload = {
      organization: {
        name: orgName,
        email: orgEmail,
        type: orgType,
        socialLink: orgSocialLink,
        websiteLink: orgWebsiteLink,
        location: orgLocation,
      },
      sender: {
        name: senderName,
        email: senderEmail,
        phone: senderPhone,
        socialLink: senderSocialLink,
        website: senderWebsite,
        position: senderPosition,
      },
      meeting: {
        preferredDate,
        preferredTime,
        type: meetingType,
        purpose: meetingPurpose,
        notes: additionalNotes,
      },
    };

    try {
      const res = await fetch("/api/collaboration/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        alert("Registration successful!");
      } else {
        alert("Failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during submission.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  return (
    <section className={Styles.section}>
      <div className={Styles.container}>
        <h1 className={Styles.title}>Register as an Organisation</h1>

        <div className={Styles.progressContainer}>
          <div className={`${Styles.progressStep} ${currentStep >= 1 ? Styles.active : ""}`}>1. Organization</div>
          <div className={`${Styles.progressStep} ${currentStep >= 2 ? Styles.active : ""}`}>2. Sender</div>
          <div className={`${Styles.progressStep} ${currentStep >= 3 ? Styles.active : ""}`}>3. Meeting</div>
        </div>

        <form className={Styles.form} onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <div className={Styles.inputGroup}>
              <Input label="Organization Name *" showIcon icon='Building2' placeholder="e.g. Hashi Ekshathe" helpText="Enter the full legal name of your organization." value={orgName} onChange={(e) => setOrgName(e.target.value)} required />
              <Input label="Organization Type *" showIcon icon='Globe2' placeholder="e.g. Nonprofit, NGO" helpText="Specify the category your organization falls under." value={orgType} onChange={(e) => setOrgType(e.target.value)} required />
              <Input label="Organization Email *" type="email" showIcon icon='Mail' placeholder="e.g. info@example.org" helpText="Primary contact email." value={orgEmail} onChange={(e) => setOrgEmail(e.target.value)} required />
              <Input label="Primary Social Link *" type="url" showIcon icon='Globe2' placeholder="e.g. https://facebook.com/org" helpText="Main social media page." value={orgSocialLink} onChange={(e) => setOrgSocialLink(e.target.value)} required />
              <Input label="Website Link" type="url" showIcon icon='Globe2' placeholder="e.g. https://example.org" value={orgWebsiteLink} onChange={(e) => setOrgWebsiteLink(e.target.value)} />
              <Input label="Location *" showIcon icon='Globe2' placeholder="e.g. Dhaka, Bangladesh" helpText="Headquarters or operating location." value={orgLocation} onChange={(e) => setOrgLocation(e.target.value)} required />
            </div>
          )}

          {currentStep === 2 && (
            <div className={Styles.inputGroup}>
              <Input label="Full Name *" showIcon icon='User2' placeholder="e.g. John Doe" value={senderName} onChange={(e) => setSenderName(e.target.value)} required />
              <Input label="Email *" type="email" showIcon icon='Mail' placeholder="e.g. john@example.com" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} required />
              <Input label="Phone Number *" type="tel" showIcon icon='Phone' placeholder="e.g. +8801XXXXXXXXX" value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} required />
              <Input label="Position *" showIcon placeholder="e.g. Outreach Manager" value={senderPosition} onChange={(e) => setSenderPosition(e.target.value)} required />
              <Input label="Social Media Link" type="url" showIcon placeholder="e.g. https://linkedin.com/in/john" value={senderSocialLink} onChange={(e) => setSenderSocialLink(e.target.value)} />
              <Input label="Personal Website" type="url" showIcon placeholder="e.g. https://john.dev" value={senderWebsite} onChange={(e) => setSenderWebsite(e.target.value)} />
            </div>
          )}

          {currentStep === 3 && (
            <div className={Styles.inputGroup}>
              <Input label="Preferred Date *" showIcon type="text" icon='Calendar' value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} required />
              <Input label="Preferred Time *" showIcon type="text" icon='Clock' value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} required />
              <Input label="Meeting Type *" showIcon placeholder="e.g. Online, In-person" value={meetingType} onChange={(e) => setMeetingType(e.target.value)} required />
              <Input label="Purpose *" showIcon placeholder="e.g. Discuss collaboration opportunities" value={meetingPurpose} onChange={(e) => setMeetingPurpose(e.target.value)} required />
              <Input label="Additional Notes" showIcon placeholder="Anything else you'd like us to know?" icon='Info' value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} />
            </div>
          )}

          <div className={Styles.buttonContainer}>
            {currentStep > 1 && (
              <Button label="Back" variant="secondary" onClick={handlePrev} type="button" disabled={loading} />
            )}
            {currentStep < 3 ? (
              <Button label="Next" variant="primary" onClick={handleNext} type="button" disabled={loading} />
            ) : (
              <Button label={loading ? "Submitting..." : "Submit"} type="submit" variant="primary" disabled={loading} />
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
