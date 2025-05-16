"use client";

import React, { useState } from "react";
import { ClockIcon, Pencil, Trash } from "lucide-react";

interface TaskCardProps {
  title: string;
  priority: string;
  description: string;
  date: string;
  user: string;
  status: string;
}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  priority,
  description,
  date,
  user,
  status,
}) => {
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentStatus(e.target.value);
  };

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

  return (
    <div
      className={`w-full max-w-md p-6 flex flex-col gap-4 shadow-lg rounded-xl border ${
        statusStyles[currentStatus as keyof typeof statusStyles] || "border-gray-200"
      } bg-white hover:shadow-xl transition-shadow duration-300`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
          {currentStatus === "todo" && (
            <div className="flex gap-2">
              <Pencil className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-500 transition-colors" />
              <Trash className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700 transition-colors" />
            </div>
          )}
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            priorityStyles[priority.toLowerCase() as keyof typeof priorityStyles] ||
            "bg-gray-200 text-gray-800"
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
      <select
        value={currentStatus}
        onChange={handleStatusChange}
        className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="todo">To Do</option>
        <option value="inprogress">In Progress</option>
        <option value="review">Review</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
};

export default TaskCard;