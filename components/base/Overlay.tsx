import { cn } from "@/utils/utils";

const Overlay = ({
  state,
  setState,
  className,
  children = null,
  childrenClass = "",
}: OverlayProps) => {
  return (
    <>
      <div className={cn("fixed top-[72px] bg-white", childrenClass)}>
        {children}
      </div>

      <div
        className={cn(
          "fixed z-10 w-full h-full left-0 top-0 bg-transparent",
          className
        )}
        onClick={() => {
          if (setState) {
            setState(!state);
          }
        }}
      ></div>
    </>
  );
};

export default Overlay;
