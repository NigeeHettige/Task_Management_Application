"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { createTask, updateTask } from "@/utils/apiHelper";
interface User {
  name: string;
  id: number;
}
interface TaskFormProps {
  setIsTaskFormOpen: React.Dispatch<React.SetStateAction<boolean>>;

  values?: {
    id: string;
    title: string;
    priority: string;
    description: string;
    date: string;
    user: string;
    status: string;
  } | null;
  edit?: boolean;
  users: User[];
}

const TaskForm: React.FC<TaskFormProps> = ({
  setIsTaskFormOpen,

  values,
  edit = false,
  users,
}) => {
  const [formData, setFormData] = useState({
    id: values?.id || "",
    title: values?.title || "",
    description: values?.description || "",
    priority: values?.priority || "Medium",
    date: values?.date || "",
    user: values?.user || "",
    status: values?.status || "todo",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const selectedUser = users.find((u) => u.name === formData.user);
      if (!selectedUser && formData.user) {
        throw new Error("Selected user not found");
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority.toLowerCase(),
        assigned_to: selectedUser ? selectedUser.id : 0,
        due_date: new Date(formData.date).toISOString(),
        status: formData.status,
      };

      if (edit) {
        await updateTask(parseInt(formData.id, 10), payload);
      } else {
        await createTask(payload);
      }

      setIsTaskFormOpen(false);
    } catch (error) {
      console.error("Error:", error);
      // Add user feedback here
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50 w-screen h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col bg-white w-full max-w-md rounded-xl p-6 relative shadow-lg overflow-auto max-h-[80vh]"
      >
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={() => setIsTaskFormOpen(false)}
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="font-semibold text-xl text-gray-800 mb-6 text-center">
          {edit ? "Edit Task" : "Create New Task"}
        </h3>

        <div className="flex flex-col w-full mb-4">
          <label
            htmlFor="title"
            className="text-gray-500 font-medium text-sm mb-1"
          >
            Task Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border border-gray-300 w-full rounded-md h-10 px-3 text-custom_text outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex flex-col w-full mb-4">
          <label
            htmlFor="description"
            className="text-gray-500 font-medium text-sm mb-1"
          >
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border border-gray-300 w-full rounded-md h-24 px-3 py-2 text-custom_text outline-none resize-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-row gap-4 w-full mb-4">
          <div className="flex flex-col w-1/2">
            <label
              htmlFor="user"
              className="text-gray-500 font-medium text-sm mb-1"
            >
              Assignee
            </label>
            <select
              name="user"
              value={formData.user}
              onChange={handleChange}
              required
              className="text-custom_text"
            >
              <option value="">Select Assignee</option>
              {users.map((user) => (
                <option key={user.id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-1/2">
            <label
              htmlFor="date"
              className="text-gray-500 font-medium text-sm mb-1"
            >
              Due Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="border border-gray-300 w-full rounded-md h-10 pl-3 pr-10 text-custom_text outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-4 w-full mb-6">
          <div className="flex flex-col w-1/2">
            <label
              htmlFor="status"
              className="text-gray-500 font-medium text-sm mb-1"
            >
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border border-gray-300 w-full rounded-md h-10 px-3 text-gray-900 text-base outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex flex-col w-1/2">
            <label
              htmlFor="priority"
              className="text-gray-500 font-medium text-sm mb-1"
            >
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="border border-gray-300 w-full rounded-md h-10 px-3 text-gray-900 text-base outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-row gap-3 w-full justify-center">
          <button
            type="button"
            className="w-1/2 py-2 rounded-md text-base text-gray-700 bg-gray-200 hover:bg-gray-300"
            onClick={() => setIsTaskFormOpen(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-1/2 py-2 rounded-md text-base text-white bg-blue-600 hover:bg-blue-700"
          >
            {edit ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
