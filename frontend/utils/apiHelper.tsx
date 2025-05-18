import axios from "axios";
import Cookies from "universal-cookie";
import config from "./config";

//login

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const login_url = config.urls.LOGIN_API_URL_RELATIVE;

  try {
    const response = await axios.post(login_url, {
      email,
      password,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

//signup
export const signup = async ({
  name,
  email,
  password,
  role,
}: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const signup_url = config.urls.SIGNUP_API_URL_RELATIVE;

  try {
    const response = await axios.post(signup_url, {
      name,
      email,
      password,
      role,
    });
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response?.data?.message || "Signup failed");
  }
};

//logout

export const logout_user = async () => {
  const logout_url = config.urls.LOGOUT_API_URL_RELATIVE;
  try {
    const response = await axios.post(logout_url);
    console.log(response);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Logout failed");
  }
};

export const get_all_users = async () => {
  const user_url = config.urls.GET_USERS_API_URL_RELETIVE;
  try {
    const response = await axios.get(user_url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("Fetching all users failed");
  }
};

//get tasks by user id
export const getTaskByUser = async (id: number) => {
  const BASE_URL = `${config.urls.GET_TASK_BY_USER_API_URL_RELATIVE}/${id}`;
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error("Fetching tasks by user failed");
  }
};


//get tasks by  id
export const getTaskByID= async (id: number) => {
  const BASE_URL = `${config.urls.GET_TASK_API_URL_RELATIVE}/${id}`;
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error("Fetching tasks by id failed");
  }
};

//get all tasks
export const getAllTask = async () => {
  const BASE_URL = config.urls.GET_ALL_TASK_API_URL_RELATIVE;
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Fetching tasks failed");
  }
};

//update task
export const updateTask = async (
  id: number,
  values: {
    title: string;
    description: string;
    priority: string;
    assigned_to: number;
    due_date: string;
    status: string;
  }
) => {
  const BASE_URL = `${config.urls.UPDATE_TASK_API_URL_RELATIVE}/${id}`;
  try {
    const response = await axios.put(BASE_URL,values,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error("Updating tasks failed");
  }
};

//delete task 
export const deleteTask = async(id: number)=>{
  const BASE_URL = `${config.urls.DELETE_TASK_API_URL_RELATIVE}/${id}`;
  try {
    const response = await axios.delete(BASE_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error("Deletion failed");
  }
}

//create task

export const createTask = async (
  
  values: {
    title: string;
    description: string;
    priority: string;
    assigned_to: number;
    due_date: string;
   
  }
) => {
  const BASE_URL = config.urls.CREATE_TASK_API_URL_RELATIVE;
 
  try {
    const response = await axios.post(BASE_URL,values,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error("Creating tasks failed");
  }
};