const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;


const config = {
  urls: {
    //user
    LOGIN_API_URL: `${BACKEND_URL}/api/login`,
    LOGIN_API_URL_RELATIVE: "/api/user/login",
    SIGNUP_API_URL:`${BACKEND_URL}/api/register`,
    SIGNUP_API_URL_RELATIVE:"/api/user/register",
    LOGOUT_API_URL:`${BACKEND_URL}/api/logout`,
    LOGOUT_API_URL_RELATIVE:"/api/user/logout",

    //tasks
    GET_ALL_TASK_API_URL:`${BACKEND_URL}/api/gettask`,
    GET_ALL_TASK_API_URL_RELATIVE:"/api/task/gettask",
    GET_TASK_API_URL:`${BACKEND_URL}/api/gettaskbyid`,
    GET_TASK_API_URL_RELATIVE:"/api/task/gettaskbyid",
    GET_TASK_BY_USER_API_URL:`${BACKEND_URL}/api/gettaskbyuserid`,
    GET_TASK_BY_USER_API_URL_RELATIVE:"/api/task/gettaskbyuserid",
    CREATE_TASK_API_URL:`${BACKEND_URL}/api/createtask`,
    CREATE_TASK_API_URL_RELATIVE:"/api/task/createtask",
    UPDATE_TASK_API_URL:`${BACKEND_URL}/api/updatetask`,
    UPDATE_TASK_API_URL_RELATIVE:"/api/task/updatetask",
    DELETE_TASK_API_URL:`${BACKEND_URL}/api/deletetask`,
    DELETE_TASK_API_URL_RELATIVE:"/api/task/deletetask",

    //other
    GET_USERS_API_URL:`${BACKEND_URL}/api/getusers`,
    GET_USERS_API_URL_RELETIVE:"/api/other/getusers",
   

  },
};

export default config;
