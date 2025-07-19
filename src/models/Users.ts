import mongoose, { Schema } from "mongoose";

// Location Schema (GeoJSON)
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
  address: String,
}, { _id: false });

// Organisation Membership Schema
const OrganisationMembershipSchema = new Schema({
  organisationId: {
    type: Schema.Types.ObjectId,
    ref: "organisations",
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "member",
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "pending"],
    default: "pending",
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  // Login Details
  name: { type: String, required: [true, "Please provide name"], trim: true },
  username: { 
    type: String, 
    required: [true, "Please provide username"], 
    unique: true,
    trim: true,
    lowercase: true,
  },
  email: { 
    type: String, 
    required: [true, "Please provide email"], 
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { 
    type: String, 
    required: [true, "Please provide password"],
    select: false, // Don't include in queries by default
  },
  
  // Password Reset & Verification
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,

  phoneNumber: {
    type: String,
    required: [true, "Please provide phone number"],
    trim: true,
    match: [/^\+?[0-9\s\-]{7,15}$/, "Please provide a valid phone number"],
  },

  dateOfBirth: { type: Date, required: [true, "Please provide date of birth"] },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: [true, "Please provide gender"],
  },
        
  isVerified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
        
  institution: { type: String, required: [true, "Please provide institution"], trim: true },
  educationLevel: { type: String, required: [true, "Please provide education level"], trim: true },
  address: { type: String, required: [true, "Please provide address"], trim: true },

  // Location (GeoJSON) - optional
  location: { type: LocationSchema, required: false },

  // Organisation and volunteer data
  organisations: { type: [OrganisationMembershipSchema], default: [] },
  userType: {
    type: String,
    enum: ["volunteer", "organisation"],
    required: true,
    default: "volunteer",
  },
  dateJoined: { type: Date, default: Date.now },
  totalHoursVolunteered: { type: Number, default: 0, min: 0 },
  totalProjectsJoined: { type: Number, default: 0, min: 0 },
  impactScore: { type: Number, default: 0 },
  certifications: { type: [String], default: [] },
  milestones: { type: [String], default: [] },

  currentlyWorkingProjects: {
    type: [Schema.Types.ObjectId],
    ref: "projects",
    default: [],
  },
}, { timestamps: true });

userSchema.index({ userType: 1 });
userSchema.index({ location: "2dsphere" }); // For geospatial queries

const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User;