// models/organisationModel.ts
import mongoose from "mongoose";

const organisationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide organisation name"],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        select: false, // Do not return password by default
    },
    registrationNumber: {
        type: String,
        required: [true, "Please provide registration number"],
        unique: true,
        trim: true,
    },
}, { timestamps: true });

const Organisation = mongoose.models.Organisations || mongoose.model("Organisations", organisationSchema);
export default Organisation;