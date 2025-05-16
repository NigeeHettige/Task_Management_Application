"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import MainCard from "@/components/Cards/MainCard";
import TaskCard from "@/components/Cards/TaskCard";
import {
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  BarChartIcon,
  Bell 
} from "lucide-react";

function Dashboard() {
  const cards = {
    mytask: {
      title: "My Task",
      icon: BarChartIcon,
      description: "Total assigned tasks",
      count: 3,
      icon_color: "text-blue-600",
    },
    completed: {
      title: "Completed",
      icon: CheckCircleIcon,
      description: "Completed tasks",
      count: 1,
      icon_color: "text-green-600",
    },
    duesoon: {
      title: "Due Soon",
      icon: ClockIcon,
      description: "Due in next 3 days",
      count: 2,
      icon_color: "text-yellow-600",
    },
    overdue: {
      title: "Overdue",
      icon: AlertCircleIcon,
      description: "Past due date",
      count: 0,
      icon_color: "text-red-600",
    },
  };

  const taskCards = {
    task1: {
      title: "UI Design Review",
      priority: "High",
      description: "Review the dashboard UI components with the team.",
      date: "2025-05-18",
      user: "Jane Doe",
      status: "inprogress",
    },
    task2: {
      title: "API Integration",
      priority: "Medium",
      description: "Integrate authentication API with frontend.",
      date: "2025-05-20",
      user: "John Smith",
      status: "todo",
    },
    task3: {
      title: "Bug Fixes",
      priority: "Low",
      description: "Fix minor issues found during QA.",
      date: "2025-05-17",
      user: "Emily Johnson",
      status: "completed",
    },
    task4: {
      title: "Deploy to Staging",
      priority: "High",
      description: "Deploy the latest build to the staging environment.",
      date: "2025-05-19",
      user: "Michael Lee",
      status: "review",
    },
  };

  return (
    <div className="bg-custom_background">
        <div className=" ml-5 mr-5 ">
      <div className="p-6 mt-10">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold text-main_title">Dashboard</h1>
            <Bell className="text-custom_text"/>
          </div>
          <p className="text-gray-600 text-lg">Welcome back, Demo user</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {Object.entries(cards).map(([key, props]) => (
              <MainCard key={key} {...props} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-gray-800">Due Soon</h2>
              {Object.entries(taskCards)
                .filter(([_, task]) => task.status !== "completed")
                .map(([key, props]) => (
                  <TaskCard key={key} {...props} />
                ))}
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-gray-800">Overdue</h2>
              {Object.entries(taskCards)
                .filter(
                  ([_, task]) =>
                    new Date(task.date) < new Date("2025-05-17") &&
                    task.status !== "completed"
                )
                .map(([key, props]) => (
                  <TaskCard key={key} {...props} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Dashboard;
