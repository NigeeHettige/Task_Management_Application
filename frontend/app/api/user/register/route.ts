import config from "@/utils/config";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { name, email, password, role } = await request.json();
    if (!name || !email || !password || !role) {
      return new NextResponse("Email, Name, Password, and Role are required", {
        status: 400,
      });
    }

    const BASE_URL = config.urls.SIGNUP_API_URL;
    const response = await axios.post(
      BASE_URL,
      {
        name,
        email,
        password,
        role,
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

    if (setCookieHeader && Array.isArray(setCookieHeader)) {
      headers.append("Set-Cookie", setCookieHeader.join(", "));
    } else if (setCookieHeader) {
      headers.append("Set-Cookie", setCookieHeader);
    }

    return new NextResponse(JSON.stringify(response.data), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Error in signup", { status: 500 });
  }
};