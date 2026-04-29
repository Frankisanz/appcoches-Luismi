import * as React from "react"
import { cn } from "@/lib/utils"

const avatarColors = [
  "bg-blue-500 text-white",
  "bg-emerald-500 text-white",
  "bg-amber-500 text-white",
  "bg-purple-500 text-white",
  "bg-rose-500 text-white",
  "bg-cyan-500 text-white",
  "bg-indigo-500 text-white",
  "bg-teal-500 text-white",
];

function getColorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: "sm" | "md" | "lg";
  showOnline?: boolean;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

export function Avatar({ name, size = "md", showOnline, className, ...props }: AvatarProps) {
  return (
    <div className={cn("relative inline-flex", className)} {...props}>
      <div
        className={cn(
          "rounded-full flex items-center justify-center font-semibold shadow-sm",
          sizeClasses[size],
          getColorForName(name)
        )}
      >
        {getInitials(name)}
      </div>
      {showOnline && (
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-pulse-dot" />
      )}
    </div>
  );
}
