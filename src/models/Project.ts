// src/models/Projects.ts


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
  name: {
    type: String,
    required: [true, "Project name is required"],
    trim: true,
  },
  location: {
    type: LocationSchema,
    required: true,
  },
}, { timestamps: true });

const Project = mongoose.models.Projects || mongoose.model("Projects", projectSchema);
export default Project;
