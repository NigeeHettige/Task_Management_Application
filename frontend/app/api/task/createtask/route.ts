import { getAccessToken } from "@/utils/Auth/AccessToken";
import { AuthHeader } from "@/utils/Auth/AuthHeader";
import config from "@/utils/config";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (
  request: NextRequest 
) => {
  const BASE_URL = config.urls.CREATE_TASK_API_URL;

 
  try {
    const accessToken = await getAccessToken(request);
    if (!accessToken) {
      return new NextResponse("Access token not found", { status: 401 });
    }
    const body = await request.json();
    console.log("BODY",body)

    const values = {
      title: body.title as string,
      description: body.description as string,
      priority: body.priority as string,
      assigned_to: body.assigned_to as number,
      due_date: body.due_date as string,
      status: body.status as string,
    };

    const response = await axios.post(BASE_URL, values, AuthHeader(accessToken));

    console.log(response);
    return new NextResponse(JSON.stringify(response.data), {
      status: 200,
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("AXIOS ERROR:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
      return new NextResponse(
        JSON.stringify({
          error: error.response?.data || "Axios error",
        }),
        { status: error.response?.status || 500 }
      );
    } else {
      console.error("AXIOS ERROR:", {
        message: error.message,
        data: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });

      console.error("UNKNOWN ERROR:", error);
      return new NextResponse("Unknown error", {
        status: 500,
      });
    }
  }
};
