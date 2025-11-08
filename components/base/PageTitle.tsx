import React from "react";

const PageTitle = ({
  title,
  icon,
  className = "",
  titleClass = "",
}: PageTitleProps) => {
  return (
    <div className={`flex items-center gap-4 mb-6 ${className}`}>
      {icon && (
        <div className="bg-primary/5 text-primary p-2 rounded-xl flex items-center justify-center">
          {icon}
        </div>
      )}

      <h1 className={`text-[27px] font-semibold text-dark ${titleClass}`}>
        {title}
      </h1>
    </div>
  );
};

export default PageTitle;
