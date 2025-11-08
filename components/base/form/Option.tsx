import { cn } from "@/utils/utils";
import { FaCheckCircle } from "react-icons/fa";

type SelectOptionType = {
  option: Option;
  onClick: VoidFunction;
  className?: string;
  isSelected: boolean;
  selectedClassName?: string;
};

const Option = ({
  option,
  onClick,
  isSelected,
  className,
  selectedClassName,
}: SelectOptionType) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 px-3 py-2 w-full text-[14px] hover:bg-primary/10 overflow-hidden transition-all cursor-pointer border-t border-gray-200 rounded-[10px] bg-gray-50 !border-none mb-1",
        isSelected && `ring-1 ring-primary/80 ${selectedClassName}`,
        className
      )}
      onClick={onClick}
    >
      {option.label}

      {isSelected && <FaCheckCircle className="w-[16px] text-primary " />}
    </div>
  );
};

export default Option;
