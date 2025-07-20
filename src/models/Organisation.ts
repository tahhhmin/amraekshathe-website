// models/Organization.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose"; // Import Types

// Define the Organization Document interface
export interface IOrganization extends Document {
  _id: Types.ObjectId; // Explicitly define _id type to ensure TypeScript knows its type
  email: string;
  password?: string; // Optional because it might be excluded in queries
  organizationName: string;
  contactPerson: string;
  phoneNumber: string;
  address: string;
  
  isVerified: boolean;
  dateJoined: Date;
  
  // Verification tokens
  verifyToken?: string;
  verifyTokenExpiry?: Date;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;

  userType: "organization"; // Explicitly define user type
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
      select: false, // Do not return password by default in queries
    },
    organizationName: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
      unique: true, // Ensure organization names are unique
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
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
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
      enum: ["organization"], // Ensure it's always 'organization'
      immutable: true, // Prevent changing userType after creation
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Export the Organization model first, so it's available for the pre-save hook
const Organization =
  (mongoose.models.Organization as Model<IOrganization>) ||
  mongoose.model<IOrganization>("Organization", OrganizationSchema);


// Add a pre-save hook to ensure the email and organizationName are unique case-insensitively
OrganizationSchema.pre<IOrganization>("save", async function (next) {
  // Use the directly exported Organization model for queries
  if (this.isModified("email") && this.email) {
    const existingOrg = await Organization.findOne({
      email: this.email,
      _id: { $ne: this._id } // Exclude current document in case of update
    });
    // TypeScript should now correctly infer existingOrg as IOrganization | null
    if (existingOrg) {
      return next(new Error("Email is already registered by another organization."));
    }
  }
  if (this.isModified("organizationName") && this.organizationName) {
    const existingOrg = await Organization.findOne({
      organizationName: this.organizationName,
      _id: { $ne: this._id } // Exclude current document in case of update
    });
    // TypeScript should now correctly infer existingOrg as IOrganization | null
    if (existingOrg) {
      return next(new Error("Organization name is already taken."));
    }
  }
  next();
});

export default Organization;
