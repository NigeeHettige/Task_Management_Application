"use client";
import Link from "next/link";
import React from "react";
import {
  LayoutDashboardIcon,
  CheckSquareIcon,
  UserIcon,
  LogOutIcon,
  Sidebar,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function SideBar() {
  const nav = {
    Dashboard: { link: "/dashboard", icon: LayoutDashboardIcon },
    Task: { link: "/task", icon: CheckSquareIcon },
  };

  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout =  () => {
     logout();
  };
  return (
    <div className=" fixed w-1/5 h-screen bg-white flex flex-col justify-between">
      {/* Top + Navigation Part */}
      <div>
        <div className="flex flex-col ml-5 mt-10">
          <h2 className="text-title font-bold text-2xl">TaskFlow</h2>
        </div>
        <div className="w-full h-0.5 bg-line mt-5"></div>
        <div className="flex flex-col gap-4 mt-5 ml-5">
          {Object.entries(nav).map(([label, { link, icon: Icon }]) => {
            const isActive = pathname === link;

            return (
              <div
                key={label}
                className={`px-10 py-5 mr-5 rounded-xl flex gap-4 items-center hover:bg-custom_background cursor-pointer
                ${isActive ? "bg-button" : ""}`}
              >
                <Icon className="text-custom_text w-6 h-6" />
                <Link
                  href={link}
                  className="text-custom_text text-xl font-normal "
                >
                  {label}
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Part */}
      <div className="mb-5">
        <div className="w-full h-0.5 bg-line" />
        <div className="flex items-center gap-3 px-10 py-4 mt-4 cursor-pointer hover:bg-custom_background rounded-xl">
          <LogOutIcon className="text-custom_logout w-6 h-6" />
          <Link
            href="/" // Default href (overridden by logout)
            onClick={(e) => {
              e.preventDefault(); // Prevent default navigation
              handleLogout();
            }}
            className="text-custom_logout text-xl font-normal"
          >
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
