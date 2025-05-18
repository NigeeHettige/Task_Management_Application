"use client";

import React, { useEffect, useState } from "react";

import MainCard from "@/components/Cards/MainCard";
import TaskCard from "@/components/Cards/TaskCard";
import {
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  BarChartIcon,
  Bell,
} from "lucide-react";
import AuthLayout from "../AuthLayout";
import { getAllTask, getTaskByUser } from "@/utils/apiHelper";
import { useAuth } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigned_to: string; // Remains string as per your current interface
  created_by: string;
  due_date: Date;
  created_at: Date;
}

interface User {
  name: string;
  id: number;
}

// Define the expected JWT payload structure
interface JwtPayload {
  id: number;
  email?: string;

  iat?: number;
  exp?: number;
}

interface CardProps {
  title: string;
  icon: React.FC<{ className?: string }>;
  description: string;
  count: number;
  icon_color: string;
}

interface Cards {
  mytask: CardProps;
  completed: CardProps;
  duesoon: CardProps;
  overdue: CardProps;
}

interface TaskCard {
  id:number;
  title: string;
  priority: "High" | "Medium" | "Low";
  description: string;
  date: string;
  user: string;
  status: string;
}

function Dashboard() {
  const { accessToken, isAuthenticated, user, getAllusers } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksall, setTasksall] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const priorityOrder = { High: 3, Medium: 2, Low: 1 };

  // Fetching own tasks
  const fetchTasks = async () => {
    if (!isAuthenticated || !accessToken) {
      console.warn("Not authenticated or no access token available");
      return [];
    }

    try {
      const decoded: JwtPayload = jwtDecode(accessToken);
      const userId = decoded.id;
      if (!userId) {
        throw new Error("User ID not found in access token");
      }

      const response = await getTaskByUser(userId);
      return response.data || response; // Adjust based on API response
    } catch (error) {
      console.error("Error decoding token or fetching tasks:", error);
      throw error;
    }
  };

  // Fetch all tasks
  const fetchAllTasks = async () => {
    if (!isAuthenticated || !accessToken) {
      console.warn("Not authenticated or no access token available");
      return [];
    }

    try {
      const response = await getAllTask();
      return response.data || response; // Adjust based on API response
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  };

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const userTasks = await fetchTasks();
        const allTasks = await fetchAllTasks();
        setTasks(userTasks || []);
        setTasksall(allTasks || []);
      } catch (error) {
        console.error("Failed to load tasks:", error);
      }
    };

    loadTasks();
    const fetchUsers = async () => {
      const data = await getAllusers();
      const usersData = Array.isArray(data) ? data : [];
      setUsers(usersData as User[]);
    };
    fetchUsers();
  }, [accessToken, isAuthenticated, getAllusers]);

  console.log("All tasks are", tasksall);
  console.log("users are", users);

  // Calculate card counts
  const today = new Date();
  const threeDaysFromNow = new Date(today);
  threeDaysFromNow.setDate(today.getDate() + 3);

  const myTaskCount = tasks.length;
  const completedCount = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const dueSoonCount = tasks.filter((task) => {
    const dueDate = new Date(task.due_date);
    return dueDate >= today && dueDate <= threeDaysFromNow;
  }).length;
  const overdueCount = tasks.filter((task) => {
    const dueDate = new Date(task.due_date);
    return dueDate < today;
  }).length;

  const cards: Cards = {
    mytask: {
      title: "My Task",
      icon: BarChartIcon,
      description: "Total assigned tasks",
      count: myTaskCount,
      icon_color: "text-blue-600",
    },
    completed: {
      title: "Completed",
      icon: CheckCircleIcon,
      description: "Completed tasks",
      count: completedCount,
      icon_color: "text-green-600",
    },
    duesoon: {
      title: "Due Soon",
      icon: ClockIcon,
      description: "Due in next 3 days",
      count: dueSoonCount,
      icon_color: "text-yellow-600",
    },
    overdue: {
      title: "Overdue",
      icon: AlertCircleIcon,
      description: "Past due date",
      count: overdueCount,
      icon_color: "text-red-600",
    },
  };

  const sortTasksByPriority = (taskEntries: [string, TaskCard][]) => {
    return taskEntries.sort(
      ([, a], [, b]) => priorityOrder[b.priority] - priorityOrder[a.priority]
    );
  };

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
      };
      return acc;
    }, {} as { [key: string]: TaskCard });
  };

  const taskCards = transformTasksToTaskCards(tasksall, users);

  const dueSoonThreshold = new Date(today);
  dueSoonThreshold.setDate(today.getDate() + 7);

  return (
    <AuthLayout>
      <div className="bg-custom_background">
        <div className="ml-5 mr-5">
          <div className="p-6 mt-10">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <h1 className="text-3xl font-bold text-main_title">
                  Dashboard
                </h1>
                <Bell className="text-custom_text" />
              </div>
              <p className="text-gray-600 text-lg">
                Welcome back, {user?.name}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                {Object.entries(cards).map(([key, props]) => (
                  <MainCard key={key} {...props} />
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-bold text-gray-800">Due Soon</h2>
                  {sortTasksByPriority(
                    Object.entries(taskCards).filter(([_, task]) => {
                      const taskDate = new Date(task.date);
                      return (
                        task.status !== "completed" &&
                        taskDate >= today &&
                        taskDate <= dueSoonThreshold
                      );
                    })
                  ).map(([key, props]) => (
                    <TaskCard
                      key={key}
                      {...props}
                      isDashboard={true}
                      canEdit={false}
                      canDelete={false}
                    />
                  ))}
                </div>
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-bold text-gray-800">Overdue</h2>
                  {sortTasksByPriority(
                    Object.entries(taskCards).filter(([_, task]) => {
                      const taskDate = new Date(task.date);
                      return task.status !== "completed" && taskDate < today;
                    })
                  ).map(([key, props]) => (
                    <TaskCard
                      key={key}
                      {...props}
                      isDashboard={true}
                      canEdit={false}
                      canDelete={false}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Dashboard;
