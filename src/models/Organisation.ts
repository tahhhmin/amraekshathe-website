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

const organisationSchema = new mongoose.Schema({
  // === Core Identity ===
  name: {
    type: String,
    required: [true, "Please provide organisation name"],
    unique: true,
    trim: true,
  },
  orgType: {
    type: String,
    required: true,
    enum: ["NGO", "Charity", "Student Club", "Community Group", "Non-Profit", "Other"],
  },
  orgDescription: { type: String, required: true },
  constitutionURL: { type: String, trim: true },
  establishedYear: {
    type: Number,
    min: 1800,
    max: new Date().getFullYear(),
  },
  orgSize: {
    type: String,
    enum: ["Small", "Medium", "Large"],
    default: "Small"
  },

  // === Contact & Communication ===
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  alternateEmail: { type: String, trim: true },
  phone: { type: String, trim: true },
  alternatePhone: { type: String, trim: true },
  officeHours: { type: String, trim: true },
  allowLiveChat: { type: Boolean, default: false },

  // === Location ===
  address: {
    type: String,
    required: true,
    trim: true,
  },
  location: { type: LocationSchema },

  // === Online Presence & Branding ===
  website: { type: String, trim: true },
  socials: {
    facebook: { type: String, trim: true },
    twitter: { type: String, trim: true },
    instagram: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    youtube: { type: String, trim: true },
  },
  logo: { type: String, trim: true },
  banner: { type: String, trim: true },

  // === Profile Information ===
  mission: { type: String, trim: true, maxlength: 2000 },
  vision: { type: String, trim: true, maxlength: 2000 },
  about: { type: String, trim: true, maxlength: 5000 },
  goals: { type: [String], default: [] },

  impactHighlights: {
    type: [{
      title: String,
      number: Number,
      unit: String, // e.g. meals, students, kits
    }],
    default: []
  },

  // === Verification & Trust ===
  isVerified: { type: Boolean, default: false },


  // === Account & Security ===
  password: {
    type: String,
    required: true,
    select: false,
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },


  // === Projects ===
  totalProjects: { type: Number, default: 0 },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  projectCategories: { type: [String], default: [] },

  // === Volunteers ===
  totalVolunteers: { type: Number, default: 0 },
  volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Volunteer" }],
  needsVolunteers: { type: Boolean, default: false },
  volunteerSignupLink: { type: String, trim: true },
  volunteerCustomQuestions: { type: [String], default: [] },

  // === UI Settings & Flags ===
  isFeatured: { type: Boolean, default: false },
  showOnHomepage: { type: Boolean, default: false },


}, { timestamps: true });


const Organisation = mongoose.models.Organisations || mongoose.model("Organisations", organisationSchema);
export default Organisation;
