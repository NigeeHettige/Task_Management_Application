import { getAccessToken } from "@/utils/Auth/AccessToken";
import { AuthHeader } from "@/utils/Auth/AuthHeader";
import config from "@/utils/config";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const params = await context.params; 
  console.log('Incoming request for user ID:', params.id);
  const accessToken = getAccessToken(request);
  if (!accessToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = params.id;
  const BASE_URL = `${config.urls.DELETE_TASK_API_URL}/${userId}`;
  console.log("Requesting URL:", BASE_URL); 

  try {
    const response = await axios.delete(BASE_URL, {
      ...AuthHeader(accessToken),
      timeout: 5000 
    });
    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", {
        status: error.response?.status,
        data: error.response?.data,
        url: BASE_URL
      });
      return NextResponse.json(
        { error: error.response?.data?.message || "API Error" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};