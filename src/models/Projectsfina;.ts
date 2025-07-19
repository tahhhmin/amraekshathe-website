import mongoose, { Schema } from "mongoose";

// GeoJSON Location Schema
const LocationSchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
    default: "Point",
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
  },
  address: {
    type: String,
    trim: true,
  },
}, { _id: false });

const projectSchema = new mongoose.Schema({
  // === Basic Info ===
  title: {
    type: String,
    required: [true, "Please provide project title"],
    trim: true,
  },
  projectType: {
    type: String,
    enum: ["Event", "Distribution", "Education", "Donation", "Campaign", "Construction", "Other"],
    default: "Other",
  },
  category: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 5000,
  },
  tags: {
    type: [String],
    default: [],
  },

  // === Owner ===
  organisation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organisations",
    required: true,
  },

  // === Timeline ===
  status: {
    type: String,
    enum: ["Upcoming", "Ongoing", "Completed"],
    default: "Upcoming",
  },
  startDate: { type: Date },
  endDate: { type: Date },

  // === Location ===
  address: { type: String, trim: true },
  location: { type: LocationSchema },
  city: { type: String, trim: true },
  region: { type: String, trim: true },

  // === Volunteers ===
  needsVolunteers: { type: Boolean, default: false },
  volunteerLimit: { type: Number, default: 0 },
  volunteersApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: "Volunteer" }],
  volunteerQuestions: { type: [String], default: [] },
  volunteerSignupURL: { type: String },

  // === Donations & Budget ===
  acceptsDonations: { type: Boolean, default: false },
  budgetNeeded: { type: Number, default: 0 },
  amountRaised: { type: Number, default: 0 },
  donationHistory: [{
    donorName: String,
    amount: Number,
    date: { type: Date, default: Date.now },
  }],

  // === Media & Impact ===
  coverImage: { type: String },
  gallery: { type: [String], default: [] },
  impactSummary: {
    type: String,
    trim: true,
    maxlength: 2000,
  },

  // === Settings & Flags ===
  isPublished: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },

}, { timestamps: true });

const Project = mongoose.models.Projects || mongoose.model("Projects", projectSchema);
export default Project;
