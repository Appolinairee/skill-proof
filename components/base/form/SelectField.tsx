"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import Label from "./Label";
import Option from "./Option";
import { cn } from "@/utils/utils";
import { useGetSelect } from "./selectfield/useGetSelect";
import ButtonLoading from "@/components/base/button/ButtonLoading";

type SelectFieldProps = {
  className?: string;
  value?: string | number | any;
  url?: string;
  onChange: any;
  errorMessage?: string | null;
  label?: string;
  icon?: React.ReactElement;
  options?: Option[];
  inputClassName?: string;
  placeholder?: string;
  isRequired?: boolean;
  cardClassName?: string;
  errors?: Record<string, any>;
  isSearchable?: boolean;
  optionClassName?: string;
  selectedClassName?: string;
  isDisabled?: boolean;
};

const SelectField = forwardRef<HTMLDivElement, SelectFieldProps>(
  (
    {
      className = "",
      value,
      url,
      onChange,
      errorMessage,
      label,
      icon: Icon,
      options,
      inputClassName = "",
      placeholder,
      isRequired,
      cardClassName = "",
      optionClassName = "",
      selectedClassName = "",
      isSearchable = false,
      isDisabled = false,
    },
    ref
  ) => {
    const [inputId, setInputId] = useState<string>("");
    const [selected, setSelected] = useState<string | number | undefined>(
      value
    );
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const selectRef = useRef<HTMLDivElement | null>(null);
    const [dropUp, setDropUp] = useState(false);
    const [hasBeenOpened, setHasBeenOpened] = useState(false);

    useEffect(() => {
      if (isOpen && !hasBeenOpened) {
        setHasBeenOpened(true);
      }
    }, [isOpen, hasBeenOpened]);

    const { options: remoteOptions, isPending } = useGetSelect(
      hasBeenOpened ? url : "",
      isSearchable ? searchQuery : ""
    );

    const displayOptions =
      Number(options?.length) > 0 ? options : remoteOptions || [];

    useEffect(() => {
      const generatedId = `select_${Math.random().toString(36).substr(2, 9)}`;
      setInputId(generatedId);
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, []);

    const handleButtonClick = () => {
      if (isDisabled) return;

      if (selectRef.current) {
        const rect = selectRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const dropdownHeight = 250;

        setDropUp(spaceBelow < dropdownHeight);
      }

      setIsOpen((prev) => !prev);
    };

    const handleOptionClick = (optionValue: string | number) => {
      setSelected(optionValue);
      onChange(optionValue);
      setIsOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    return (
      <div>
        {label && (
          <Label
            title={label}
            icon={Icon}
            htmlFor={inputId}
            required={!!isRequired}
          />
        )}

        <div
          ref={(node) => {
            selectRef.current = node;
            if (ref) {
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                (ref as React.MutableRefObject<HTMLDivElement | null>).current =
                  node;
              }
            }
          }}
          className={`${className} relative flex flex-col gap-2 bg-white w-auto text-[15px] rounded-[15px]`}
        >
          <button
            type="button"
            className={cn(
              inputClassName,
              "btn-base border-btn !justify-between !font-normal !px-4",
              isDisabled ? "opacity-50 cursor-not-allowed" : ""
            )}
            onClick={handleButtonClick}
          >
            <span className="max-w-[80%] overflow-hidden text-ellipsis">
              {displayOptions?.find(
                (option: Option) => option.value == (selected || value)
              )?.label ||
                label ||
                placeholder}
            </span>

            <MdKeyboardArrowDown
              className={`inline-block text-dark/90 font-medium transition-all duration-150 ${isOpen ? "rotate-180" : "rotate-0"}`}
            />
          </button>

          {isOpen && (
            <div
              className={`absolute ${
                dropUp ? "bottom-[100%] mb-2" : "top-[95%] mt-2"
              } left-0 bg-white border border-gray-300 rounded-[15px] shadow-soft z-10 p-2 py-1 w-auto max-h-[45vh] overflow-y-auto custom-scrollbar overflow-hidden ${cardClassName}`}
            >
              {isSearchable && (
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="input !rounded-[10px] !py-[8px]"
                />
              )}

              <p className="font-medium text-[14px] mx-2 my-1">{placeholder}</p>

              {isPending ? (
                <div className="flex justify-center py-4">
                  <ButtonLoading />
                </div>
              ) : displayOptions?.length === 0 ? (
                <div className="p-2 text-center text-gray-500">
                  Aucun résultat
                </div>
              ) : (
                displayOptions?.map((option: Option) => (
                  <Option
                    key={`${option.value}key`}
                    option={option}
                    isSelected={option.value === selected}
                    onClick={() => handleOptionClick(option.value)}
                    className={optionClassName}
                    selectedClassName={selectedClassName}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {errorMessage && <p className="input-error-message">{errorMessage}</p>}
      </div>
    );
  }
);

SelectField.displayName = "SelectField";

export default SelectField;
