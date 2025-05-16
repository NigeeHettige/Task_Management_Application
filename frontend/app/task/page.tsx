"use client"
import React, { useState } from "react";
import TaskCard from "@/components/Cards/TaskCard";
import TaskForm from "@/components/TaskForm";

function Task() {
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

  // Filter tasks by status
  const filterTasksByStatus = (status: string) =>
    Object.entries(taskCards)
      .filter(([, task]) => task.status === status)
      .map(([key, task]) => <TaskCard key={key} {...task} />);

      const[istestOpen,setistestOpen] = useState(false)

  return (
   <div  className="bg-custom_background">
     <div className="flex flex-col  ml-5 mr-5 p-6">
      <div className="flex justify-between mb-6 mt-10">
        <p className="text-main_title font-bold text-3xl">Tasks</p>
        <button className="px-5 py-3 bg-custom_blue text-custom_background rounded-xl" onClick={()=>{setistestOpen(!istestOpen)}}>
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
                <div className={`w-4 h-4 ${statusColorMap[status]} rounded-full`} />
                <p className="text-main_title font-bold text-xl">{statusLabelMap[status]}</p>
              </div>

              {/* Scrollable Column */}
              <div className="flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar">
                {filterTasksByStatus(status)}
              </div>
            </div>
          );
        })}
      </div>
      {istestOpen?<TaskForm setIsTaskFormOpen={setistestOpen}/>:""}
    </div>
   </div>
  );
}

export default Task;
