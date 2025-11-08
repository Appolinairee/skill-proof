import { cn } from "@/utils/utils";
import { ElementType, ComponentPropsWithoutRef } from "react";

interface StarBorderButtonProps<T extends ElementType> {
  as?: T;
  color?: string;
  speed?: string;
  className?: string;
  children: React.ReactNode;
}

export function StarBorderButton<T extends ElementType = "button">({
  as,
  className,
  color,
  speed = "2s",
  children,
  ...props
}: StarBorderButtonProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof StarBorderButtonProps<T>>) {
  const Component = as || "button";
  const defaultColor = color || "#f97316";

  return (
    <Component
      className={cn(
        "relative inline-block py-[1px] overflow-hidden cursor-pointer rounded-[20px]",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "absolute w-[300%] h-[50%] bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0",
          "opacity-30"
        )}
        style={{
          background: `radial-gradient(circle, ${defaultColor}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className={cn(
          "absolute w-[300%] h-[50%] top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0",
          "opacity-30"
        )}
        style={{
          background: `radial-gradient(circle, ${defaultColor}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className={cn(
          "relative z-10 border text-gray-800 text-center text-base py-4 px-6 rounded-[20px]",
          "bg-white/90 border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
        )}
      >
        {children}
      </div>
    </Component>
  );
}
