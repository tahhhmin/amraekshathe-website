// src/models/Organisation.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Define the Organization Document interface
export interface IOrganization extends Document {
    _id: Types.ObjectId;
    email: string;
    password?: string;
    organizationName: string; // The public-facing name
    slug: string; // Crucial for SEO-friendly URLs - Type will still be string, but Mongoose won't enforce 'required'
    shortDescription?: string;
    description?: string;
    imageUrl?: string;
    contactPerson: string;
    phoneNumber: string;
    address: string;
    isVerified: boolean;
    dateJoined: Date;
    verifyToken?: string;
    verifyTokenExpiry?: Date;
    forgotPasswordToken?: string;
    forgotPasswordTokenExpiry?: Date;
    userType: "organization";
    website?: string;
    category?: string;
    tags?: string[];
}

// Define the Organization Schema
const OrganizationSchema: Schema = new Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters long"],
            select: false,
        },
        contactPerson: {
            type: String,
            required: [true, "Contact person name is required"],
            trim: true,
        },
        phoneNumber: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
            match: [/^\+?[0-9\s\-]{7,15}$/, "Please use a valid phone number"],
        },

        slug: {
            type: String,
            // REMOVED: required: true, // <--- REMOVE THIS LINE
            unique: true,
            lowercase: true,
            trim: true,
            sparse: true, // Add sparse index for unique fields that are not always present
                          // Although for slug, it should always be present after pre-save.
                          // It's more for truly optional unique fields. Let's keep it for now.
        },

        isVerified: {
            type: Boolean,
            default: false,
        },
        organizationName: {
            type: String,
            required: [true, "Organization name is required"],
            trim: true,
            unique: true,
        },
        shortDescription: {
            type: String,
            maxlength: [200, "Short description cannot exceed 200 characters"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        imageUrl: {
            type: String,
            trim: true,
        },

        address: {
            type: String,
            required: [true, "Address is required"],
            trim: true,
        },
        dateJoined: {
            type: Date,
            default: Date.now,
        },

        verifyToken: String,
        verifyTokenExpiry: Date,
        forgotPasswordToken: String,
        forgotPasswordTokenExpiry: Date,
        userType: {
            type: String,
            default: "organization",
            enum: ["organization"],
            immutable: true,
        },
        website: { type: String, trim: true, sparse: true },
        category: { type: String, trim: true, sparse: true },
        tags: [{ type: String, trim: true }],
    },
    {
        timestamps: true,
    }
);

// Pre-save hook to generate slug from organizationName
OrganizationSchema.pre<IOrganization>("save", async function (next) {
    if (this.isModified("organizationName") || this.isNew) {
        if (this.organizationName) {
            this.slug = this.organizationName
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
        } else {
            // If organizationName is somehow missing, prevent save and throw error
            return next(new Error("Organization name is required to generate a slug."));
        }
    }
    next();
});

// Pre-save hook to check for unique email and organization name
OrganizationSchema.pre<IOrganization>("save", async function (next) {
    const OrganizationModel = mongoose.models.Organization as Model<IOrganization> || mongoose.model<IOrganization>("Organization", OrganizationSchema);

    if (this.isModified("email") && this.email) {
        const existingOrg = await OrganizationModel.findOne({
            email: this.email,
            _id: { $ne: this._id }
        });
        if (existingOrg) {
            return next(new Error("Email is already registered by another organization."));
        }
    }
    if (this.isModified("organizationName") && this.organizationName) {
        const existingOrg = await OrganizationModel.findOne({
            organizationName: this.organizationName,
            _id: { $ne: this._id }
        });
        if (existingOrg) {
            return next(new Error("Organization name is already taken."));
        }
    }
    next();
});

const Organization: Model<IOrganization> =
    (mongoose.models.Organization as Model<IOrganization>) ||
    mongoose.model<IOrganization>("Organization", OrganizationSchema);

export default Organization;