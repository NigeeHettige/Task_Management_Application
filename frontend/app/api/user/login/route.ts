import config from "@/utils/config";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return new NextResponse("Email and password are required", {
        status: 400,
      });
    }

    const BASE_URL = config.urls.LOGIN_API_URL;
    const response = await axios.post(
      BASE_URL,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    const setCookieHeader = response.headers["set-cookie"];
    const headers = new Headers();
    headers.append("Access-Control-Allow-Origin", "http://localhost:3001");
    headers.append("Access-Control-Allow-Credentials", "true");
    headers.append("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.append("Access-Control-Allow-Headers", "Content-Type");

    // Handle the set-cookie header array
    if (setCookieHeader && Array.isArray(setCookieHeader)) {
      // Join multiple Set-Cookie headers with commas or use the first one
      headers.append("Set-Cookie", setCookieHeader.join(", "));
    } else if (setCookieHeader) {
      // Handle case where it's a single string (unlikely with axios)
      headers.append("Set-Cookie", setCookieHeader);
    }

    return new NextResponse(JSON.stringify(response.data), {
      status: 200,
      headers,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Invalid details: ", error);
      return new NextResponse("Error in fetching login: " + error.message, {
        status: 401,
      });
    } else {
      console.error("Unknown error: ", error);
      return new NextResponse("Unknown error in login", {
        status: 500,
      });
    }
  }
};