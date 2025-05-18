import config from "@/utils/config";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const BASE_URL = config.urls.LOGOUT_API_URL;

  try {
   
    const response = await axios.post(
      BASE_URL,
      {},
      {
        withCredentials: true,
      }
    );


    const setCookieHeader = response.headers["set-cookie"];
    const headers = new Headers();
    headers.append("Access-Control-Allow-Origin", "http://localhost:3000");
    headers.append("Access-Control-Allow-Credentials", "true");
    headers.append("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.append("Access-Control-Allow-Headers", "Content-Type");
    if (setCookieHeader && Array.isArray(setCookieHeader)) {
      headers.append("Set-Cookie", setCookieHeader.join(", "));
    } else if (setCookieHeader) {
      headers.append("Set-Cookie", setCookieHeader);
    }

    return new NextResponse(JSON.stringify(response.data), {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error("Logout error:", error); 
    if (axios.isAxiosError(error)) {
      return new NextResponse(
        JSON.stringify({ message: error.response?.data?.message || "Logout failed" }),
        { status: error.response?.status || 500 }
      );
    }
    return new NextResponse("Unknown error in logout", { status: 500 });
  }
};