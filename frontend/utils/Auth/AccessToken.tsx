import { NextRequest } from "next/server";

export const getAccessToken = (request: NextRequest): string | null => {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    console.warn("No authorization header found");
    return null;
  }

  if (!authHeader.startsWith("Bearer ")) {
    console.warn("Invalid authorization header format:", authHeader);
    return null;
  }

  const tokenParts = authHeader.split(" ");
  if (tokenParts.length !== 2) {
    console.warn("Malformed authorization header:", authHeader);
    return null;
  }

  const token = tokenParts[1];
  return token.length > 0 ? token : null;
};