import { getAccessToken } from "@/utils/Auth/AccessToken";
import { AuthHeader } from "@/utils/Auth/AuthHeader";
import config from "@/utils/config";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { title } from "process";

export const PUT = async (
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
   const params = await context.params;
  console.log("came");
   const id = params.id;
  const BASE_URL = `${config.urls.UPDATE_TASK_API_URL}/${id}`;
  try {
    const accessToken = await getAccessToken(request);
    if (!accessToken) {
      return new NextResponse("Access token not found", { status: 401 });
    }
    const body = await request.json();
    console.log(body);
    const values = {
      title: body.title as string,
      description: body.description as string,
      priority: body.priority as string,
      assigned_to: body.assigned_to as number,
      due_date: body.due_date as Date,
      status: body.status as string,
    };

    const response = await axios.put(BASE_URL, values, AuthHeader(accessToken));

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
