import CloserButton from "./CloserButton";

const ModalTitle = ({
  title,
  icon,
  setActive,
  className = "",
  titleClass = "",
  count,
  description,
}: ModalTitle) => {
  return (
    <div className={`flex justify-between items-center mb-8 ${className}`}>
      <div className="flex gap-3 items-center">
        {icon && (
          <div className="py-[8px] px-[10px] bg-primary/15 rounded-full flex items-center justify-center relative">
            {icon}
            {count > 0 && (
              <span className="absolute top-0 -right-1 bg-primary rounded-full text-white text-xs font-bold p-[7px] h-4 w-4 flex items-center justify-center border-2 border-white">
                {count}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col gap-0">
          <h3
            className={`text-[20px] font-medium whitespace-nowrap truncate max-w-[200px] mobile:max-w-[300px] text-dark ${titleClass}`}
          >
            {title}
          </h3>

          {description && (
            <span className="text-sm text-gray-500">{description}</span>
          )}
        </div>
      </div>

      {setActive && <CloserButton setState={setActive} />}
    </div>
  );
};

export default ModalTitle;
