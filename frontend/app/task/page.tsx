"use client";
import React, { useEffect, useState } from "react";
import TaskCard from "@/components/Cards/TaskCard";
import TaskForm from "@/components/TaskForm";
import AuthLayout from "../AuthLayout";
import { useAuth } from "@/context/AuthContext";
import { getAllTask } from "@/utils/apiHelper";
import { jwtDecode } from "jwt-decode";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigned_to: string;
  created_by: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

interface User {
  name: string;
  id: number;
}

interface TaskCard {
  id:number;
  title: string;
  priority: "High" | "Medium" | "Low";
  description: string;
  date: string;
  user: string;
  status: string;
  createdBy: string;
}

interface JwtPayload {
  id: number;
  role: "user" | "manager" | "admin";
  email?: string;
  iat?: number;
  exp?: number;
}

function Task() {
  const { accessToken, isAuthenticated, getAllusers, user } = useAuth();
  const [tasksall, setTasksall] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [istestOpen, setistestOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<{
    id: string;
    title: string;
    priority: string;
    description: string;
    date: string;
    user: string;
    status: string;
  } | null>(null);
  const [isEdit,setIsEdit] = useState(false)
  const [currentUser, setCurrentUser] = useState<{
    id: number;
    role: string;
  } | null>(null);


  // Fetch current user info from token
  useEffect(() => {
    if (accessToken) {
      try {
        const decoded: JwtPayload = jwtDecode(accessToken);
        setCurrentUser({ id: decoded.id, role: decoded.role || "user" });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [accessToken]);

  // Fetch all tasks
  const fetchAllTasks = async () => {
    if (!isAuthenticated || !accessToken) {
      console.warn("Not authenticated or no access token available");
      return [];
    }
    try {
      const response = await getAllTask();
      return response.data || response;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    const data = await getAllusers();
    const usersData = Array.isArray(data) ? data : [];
    setUsers(usersData as User[]);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const tasks = await fetchAllTasks();
        setTasksall(tasks || []);
        await fetchUsers();
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    loadData();
  }, [accessToken, isAuthenticated, getAllusers]);

  // Transform tasks to taskCards format
  const transformTasksToTaskCards = (tasks: Task[], users: User[]) => {
    return tasks.reduce((acc, task) => {
      const user =
        users.find((u) => u.id === Number(task.assigned_to))?.name ||
        "Unknown User";
      const dueDate = new Date(task.due_date).toISOString().split("T")[0];
      acc[`task${task.id}`] = {
        id:task.id,
        title: task.title,
        priority: (task.priority.charAt(0).toUpperCase() +
          task.priority.slice(1).toLowerCase()) as "High" | "Medium" | "Low",
        description: task.description,
        date: dueDate,
        user,
        status: task.status,
        createdBy: task.created_by,
      };
      return acc;
    }, {} as { [key: string]: TaskCard });
  };

  const taskCards = transformTasksToTaskCards(tasksall, users);


  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "setEditingTask") {
        setEditingTask(event.data.task);
        setistestOpen(event.data.openForm);
        setIsEdit(true)
      } else if (event.data.type === "taskDeleted") {
        // Remove the deleted task from the state
        setTasksall((prevTasks) =>
          prevTasks.filter((task) => `task${task.id}` !== event.data.id)
        );
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const getCanEdit = (createdBy: string) => {
    if (!user) return false;
console.log("User",user)
    const isOwnTask = createdBy == user.id;

    return (
      user.roles[0] === "admin" ||
      user.roles[0] === "manager" ||
      (user.roles[0] === "user" && isOwnTask)
    );
  };

  
  const getCanDelete = (createdBy: string) => {
    if (!currentUser) return false;
    const isOwnTask = createdBy  == user.id;
    return (
      user.roles[0]  === "admin" ||
      (user.roles[0]  === "manager" && isOwnTask)
    );
  };

  // Filter tasks by status
  const filterTasksByStatus = (status: string) =>
    Object.entries(taskCards)
      .filter(([, task]) => task.status === status)
      .map(([key, task]) => (
        <TaskCard
          key={key}
          {...task}
          isDashboard={false}
          canEdit={getCanEdit(task.createdBy)}
          canDelete={getCanDelete(task.createdBy)}
        />
      ));

  console.log(users);
  return (
    <AuthLayout>
      <div className="bg-custom_background">
        <div className="flex flex-col  ml-5 mr-5 p-6">
          <div className="flex justify-between mb-6 mt-10">
            <p className="text-main_title font-bold text-3xl">Tasks</p>
            <button
              className="px-5 py-3 bg-custom_blue text-custom_background rounded-xl"
              onClick={() => {
                setistestOpen(!istestOpen);
              }}
            >
              New Task
            </button>
          </div>

          {/* Column Grid */}
          <div className="grid grid-cols-4 gap-5 h-[calc(100vh-200px)]">
            {["todo", "inprogress", "review", "completed"].map((status) => {
              const statusLabelMap: Record<string, string> = {
                todo: "To Do",
                inprogress: "In Progress",
                review: "Review",
                completed: "Completed",
              };

              const statusColorMap: Record<string, string> = {
                todo: "bg-custom_todo",
                inprogress: "bg-custom_blue",
                review: "bg-custom_purple",
                completed: "bg-custom_green_com",
              };

              return (
                <div key={status} className="flex flex-col ">
                  {/* Status Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-4 h-4 ${statusColorMap[status]} rounded-full`}
                    />
                    <p className="text-main_title font-bold text-xl">
                      {statusLabelMap[status]}
                    </p>
                  </div>

                  {/* Scrollable Column */}
                  <div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar">
                    {filterTasksByStatus(status)}
                  </div>
                </div>
              );
            })}
          </div>
          {istestOpen ? <TaskForm
              setIsTaskFormOpen={setistestOpen}
              values={editingTask}
              edit={isEdit}
              users={users}
              
            />: ""}
        </div>
      </div>
    </AuthLayout>
  );
}

export default Task;
