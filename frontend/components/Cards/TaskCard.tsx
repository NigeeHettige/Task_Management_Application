"use client";

import React, { useState } from "react";
import { ClockIcon, Pencil, Trash } from "lucide-react";
import { deleteTask, getTaskByID } from "@/utils/apiHelper";

interface TaskCardProps {
  id: number;
  title: string;
  priority: string;
  description: string;
  date: string;
  user: string;
  status: string;
  isDashboard?: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  priority,
  description,
  date,
  user,
  status,
  isDashboard = false,
  canEdit = false,
  canDelete = false,
}) => {
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentStatus(e.target.value);
  };

  console.log("From task card edit", canEdit);
  const statusStyles = {
    todo: " bg-custom_todo border-blue-200",
    inprogress: " bg-custom_light_blue  border-yellow-200",
    review: " bg-custom_review border-purple-200",
    completed: " bg-custom_light_green border-green-200",
  };

  const priorityStyles = {
    high: " bg-custom_red text-custom_logout",
    medium: " bg-custom_light_gold text-custom_gold",
    low: " bg-custom_light_green text-custom_green",
  };
  console.log("TaskCard Props:", {
    isDashboard,
    currentStatus,
    canEdit,
    canDelete,
  });

  const handleEdit = async (id: number) => {
    if (canEdit) {
      try {
        console.log("Fetching task with ID:", id);
        const response = await getTaskByID(id);
        console.log(response);

        const taskData = {
          id: id,
          title: response.title,
          priority:
            response.priority.charAt(0).toUpperCase() +
            response.priority.slice(1).toLowerCase(),
          description: response.description,
          date: response.due_date.split("T")[0],
          user: response.assigned_to_name || user,
          status: response.status,
        };

        console.log("Task fetched and form opened:", taskData);
        window.parent.postMessage(
          { type: "setEditingTask", task: taskData, openForm: true },
          "*"
        );
      } catch (error) {
        console.error("Error fetching task for edit:", error);
      }
    }
  };
  const handleDelete = async (id: number) => {
    if (canDelete) {
      try {
        const response = await deleteTask(id);
        console.log(response);
      } catch (error) {
        console.error("Error fetching task for edit:", error);
      }
    }
  };
console.log(canEdit,canDelete,"This is new onw")
  return (
    <div
      className={`w-full max-w-md p-6 flex flex-col gap-4 shadow-lg rounded-xl border ${
        statusStyles[currentStatus as keyof typeof statusStyles] ||
        "border-gray-200"
      } bg-white hover:shadow-xl transition-shadow duration-300`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
          {!isDashboard && currentStatus == "todo" && (
            <div className="flex gap-2">
              {canEdit && (
                <Pencil
                  className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-500 transition-colors"
                  onClick={() => handleEdit(id)}
                />
              )}
              {canDelete && (
                <Trash
                  className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                  onClick={() => handleDelete(id)}
                />
              )}
            </div>
          )}
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            priorityStyles[
              priority.toLowerCase() as keyof typeof priorityStyles
            ] || "bg-gray-200 text-gray-800"
          }`}
        >
          {priority}
        </span>
      </div>
      <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <ClockIcon className="w-5 h-5" />
        <span>Due: {date}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full">
          <svg
            className="absolute w-12 h-12 text-gray-400 -left-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <span className="text-gray-600">{user}</span>
      </div>
      <div className="w-full h-px bg-gray-200" />

      <p className="text-gray-800 font-medium">Status: {currentStatus}</p>
    </div>
  );
};

export default TaskCard;
