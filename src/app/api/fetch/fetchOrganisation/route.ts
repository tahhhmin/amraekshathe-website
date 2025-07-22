// src/app/api/fetch/fetchOrganisation/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/config/connectDB'; // Ensure correct path to your DB connection
import Organization from '@/models/Organisation'; // Ensure correct path to your Organization model

// === IMPORTANT FOR FRESH DATA ===
// This ensures this API route also runs dynamically and doesn't get cached.
export const dynamic = 'force-dynamic';
// === END IMPORTANT ===

export async function GET() {
  try {
    await connectDB();

    // Fetch all organizations, explicitly select relevant public fields.
    // The password field is already set to `select: false` in your schema,
    // so it won't be returned unless explicitly included.
    const organizations = await Organization.find({})
      .select('organizationName slug shortDescription description imageUrl contactPerson phoneNumber address isVerified dateJoined userType website category tags')
      .lean(); // Use .lean() for faster query execution if you don't need Mongoose document methods

    // Log the organizations before sending them to the client
    console.log("API sending organizations (slug check):", 
      organizations.map(org => ({ 
        id: org._id, 
        slug: org.slug, 
        name: org.organizationName 
      }))
    );

    // No need for further mapping here if .select() is used to get exact fields.
    // If your frontend expects different key names (e.g., 'name' instead of 'organizationName'),
    // then you'd map them here before returning.

    // For consistency with frontend, let's map `organizationName` to `name` and `address` to `location`.
    const formattedOrganizations = organizations.map(org => ({
      id: org._id.toString(), // Convert ObjectId to string
      name: org.organizationName,
      slug: org.slug,
      shortDescription: org.shortDescription,
      imageUrl: org.imageUrl,
      location: org.address,
      category: org.category,
      tags: org.tags,
      // Include other fields if needed by the frontend directly, or omit
      // This mapping is for the `OrganizationForCard` interface
    }));

    return NextResponse.json(formattedOrganizations, { status: 200 });
  } catch (error) {
    console.error('Error fetching organizations from API:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    return NextResponse.json(
      { message: 'Failed to fetch organizations', error: errorMessage },
      { status: 500 }
    );
  }
}