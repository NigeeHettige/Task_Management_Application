import { getAccessToken } from "@/utils/Auth/AccessToken";
import { AuthHeader } from "@/utils/Auth/AuthHeader";
import config from "@/utils/config";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const BASE_URL = config.urls.GET_ALL_TASK_API_URL;
  try {
    const accessToken = getAccessToken(request);
    if (!accessToken) {
      return new NextResponse("Access token not found", { status: 401 });
    }
    const response = await axios.get(BASE_URL, AuthHeader(accessToken));
    return new NextResponse(JSON.stringify(response.data), {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error fetching users:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: BASE_URL,
    });
    return new NextResponse(
      JSON.stringify({
        error:
          error.response?.data?.message || error.message || "Unknown error",
      }),
      { status: error.response?.status || 500 }
    );
  }
};
