import React from "react";
import { LucideIcon } from "lucide-react";


interface MainCardProps {
  title: string;
  icon: LucideIcon;
  description: string;
  count: number;
  icon_color:string
}

function MainCard({ title, icon: Icon, description, count,icon_color }: MainCardProps) {
  return (
  
       <div className="bg-white px-10 py-4 flex flex-col gap-3 shadow-md rounded-xl border border-line">
      <div className="flex justify-between">
        <p className="font-semibold text-custom_text">{title}</p>
        <p className={`text-xl font-bold ${icon_color}`}>{count}</p>
      </div>
      <div className="flex items-center gap-3 text-normal_text">
        <Icon className="w-5 h-5" />
        <p>{description}</p>
      </div>
    </div>
    
  );
}

export default MainCard;
