import { cn } from "@/utils/utils";
import { BsX } from "react-icons/bs";

const CloserButton = ({
  setState,
  className,
}: {
  setState: (value: boolean) => void;
  className?: string;
}) => {
  return (
    <button
      className={cn(
        "cursor-pointer p-[2px] bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-200 flex items-center justify-center",
        className
      )}
      onClick={() => setState(false)}
      aria-label="Fermer"
    >
      <BsX className="text-xl" />
    </button>
  );
};

export default CloserButton;
