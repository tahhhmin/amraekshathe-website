import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest): string | undefined => {
  try {
    const token = request.cookies.get("token")?.value || "";

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload | string;

    // If decodedToken is an object, return its id property, else undefined
    if (typeof decodedToken === "object" && decodedToken !== null && "id" in decodedToken) {
      return decodedToken.id as string;
    }
    return undefined;
  } catch (error: unknown) {
    // Safely handle unknown error type
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Unknown error occurred during token verification");
    }
  }
};
