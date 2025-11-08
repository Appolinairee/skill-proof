"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/utils/utils";
import {
  format,
  addMonths,
  addDays,
  isBefore,
  isAfter,
  isSameDay,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  addYears,
  isValid,
} from "date-fns";
import { fr } from "date-fns/locale";
import { HiCalendar, HiChevronLeft, HiChevronRight } from "react-icons/hi";

// Type definitions
// type QuickDateOption = {
//   label: string;
//   date: Date;
// };

type CalendarDayProps = {
  day: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
};

type CalendarHeaderProps = {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  isPrevMonthDisabled: boolean;
  isNextMonthDisabled: boolean;
};

// type QuickDatesProps = {
//   options: QuickDateOption[];
//   isDateDisabled: (date: Date) => boolean;
//   onDateSelect: (date: Date) => void;
// };

type DatePickerProps = {
  label?: string;
  name: string;
  placeholder?: string;
  errorMessage?: string | null;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  minDate?: Date;
  maxDate?: Date;
  disablePastDates?: boolean;
  maxFutureMonths?: number;
  className?: string;
  disabledDates?: Date[];
  showQuickDates?: boolean;
};

// Helper Components
const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  isCurrentMonth,
  isSelected,
  isDisabled,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors",
        {
          "text-gray-400": !isCurrentMonth,
          "text-gray-800": isCurrentMonth && !isSelected && !isDisabled,
          "bg-primary-500 text-white": isSelected,
          "text-gray-300 cursor-not-allowed": isDisabled,
          "hover:bg-gray-100": !isSelected && !isDisabled && isCurrentMonth,
        }
      )}
    >
      {format(day, "d")}
    </button>
  );
};

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  isPrevMonthDisabled,
  isNextMonthDisabled,
}) => {
  return (
    <div className="flex items-center justify-between mb-2">
      <button
        type="button"
        onClick={onPrevMonth}
        disabled={isPrevMonthDisabled}
        className={cn(
          "p-1 rounded-full transition-colors",
          isPrevMonthDisabled
            ? "text-gray-300 cursor-not-allowed"
            : "hover:bg-gray-100 text-gray-600"
        )}
      >
        <HiChevronLeft className="h-5 w-5" />
      </button>

      <h3 className="text-sm font-medium text-gray-800">
        {format(currentDate, "MMMM yyyy", { locale: fr })}
      </h3>

      <button
        type="button"
        onClick={onNextMonth}
        disabled={isNextMonthDisabled}
        className={cn(
          "p-1 rounded-full transition-colors",
          isNextMonthDisabled
            ? "text-gray-300 cursor-not-allowed"
            : "hover:bg-gray-100 text-gray-600"
        )}
      >
        <HiChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

// const QuickDates: React.FC<QuickDatesProps> = ({
//   options,
//   isDateDisabled,
//   onDateSelect,
// }) => {
//   return (
//     <div className="mb-2 border-b border-gray-200 pb-2">
//       {options.map((option, index) => (
//         <button
//           key={index}
//           type="button"
//           className={cn(
//             "w-full text-left py-2 px-3 text-sm rounded-md transition-colors",
//             isDateDisabled(option.date)
//               ? "text-gray-300 cursor-not-allowed"
//               : "hover:bg-gray-100 text-gray-800"
//           )}
//           onClick={() =>
//             !isDateDisabled(option.date) && onDateSelect(option.date)
//           }
//           disabled={isDateDisabled(option.date)}
//         >
//           {option.label}
//         </button>
//       ))}
//     </div>
//   );
// };

// Main DatePicker Component

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  placeholder = "Sélectionnez une date",
  errorMessage,
  required,
  value,
  onChange,
  minDate,
  maxDate: propMaxDate,
  disablePastDates = true,
  maxFutureMonths = 6,
  className,
  disabledDates = [],
  // showQuickDates = true,
}) => {
  const today = new Date();
  const calculatedMinDate = disablePastDates ? today : minDate;
  const calculatedMaxDate =
    propMaxDate ||
    (maxFutureMonths ? addMonths(today, maxFutureMonths) : addYears(today, 1));

  // State and refs
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [calendarDate, setCalendarDate] = useState<Date>(today);
  const [isOpen, setIsOpen] = useState(false);

  // Parse and format functions
  const formatForInput = (date: Date | null) => {
    return date && isValid(date) ? format(date, "yyyy-MM-dd") : "";
  };

  const parseFromInput = (dateString: string): Date | null => {
    if (!dateString) return null;
    try {
      const parsedDate = parseISO(dateString);
      return isValid(parsedDate) ? parsedDate : null;
    } catch {
      return null;
    }
  };

  const selectedDate = value ? parseFromInput(value) : null;

  // Event handlers
  const handleDateChange = (date: Date | null) => {
    const formattedDate = formatForInput(date);
    onChange(formattedDate);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCalendarDate((current) => addMonths(current, -1));
  };

  const handleNextMonth = () => {
    setCalendarDate((current) => addMonths(current, 1));
  };

  // Check if a date is disabled
  const isDateDisabled = (date: Date) => {
    return (
      (calculatedMinDate && isBefore(date, calculatedMinDate)) ||
      (calculatedMaxDate && isAfter(date, calculatedMaxDate)) ||
      disabledDates.some((disabledDate) => isSameDay(date, disabledDate))
    );
  };

  // Check if the entire next month is disabled
  const hasSelectableDaysInMonth = (monthDate: Date) => {
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const daysInMonth = eachDayOfInterval({ start, end });
    return daysInMonth.some((day) => !isDateDisabled(day));
  };

  const isPrevMonthDisabled = !hasSelectableDaysInMonth(
    addMonths(calendarDate, -1)
  );
  const isNextMonthDisabled = !hasSelectableDaysInMonth(
    addMonths(calendarDate, 1)
  );

  // Set up calendar days
  const monthStart = startOfMonth(calendarDate);
  const monthEnd = endOfMonth(calendarDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const firstDayOfMonth = monthStart.getDay();
  const prevMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) =>
    addDays(monthStart, -(firstDayOfMonth - i))
  );

  const lastDayOfMonth = monthEnd.getDay();
  const nextMonthDays = Array.from({ length: 6 - lastDayOfMonth }, (_, i) =>
    addDays(monthEnd, i + 1)
  );

  const allDays = [...prevMonthDays, ...monthDays, ...nextMonthDays];

  // Quick date options
  // const quickDates = [
  //   { label: "Aujourd'hui", date: today },
  //   { label: "Demain", date: addDays(today, 1) },
  //   { label: "Dans 3 jours", date: addDays(today, 3) },
  //   { label: "Dans une semaine", date: addDays(today, 7) },
  // ];

  // Effects
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (selectedDate) {
      setCalendarDate(selectedDate);
    }
  }, [selectedDate]);

  return (
    <div ref={datePickerRef} className={cn("relative w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <div
          className={cn(
            "flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white",
            "focus-within:ring-1 focus-within:ring-primary-500 focus-within:border-primary-500",
            "cursor-pointer hover:border-gray-400 transition-colors",
            errorMessage &&
              "border-red-500 focus-within:ring-red-500 focus-within:border-red-500"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <input
            readOnly
            placeholder={placeholder}
            value={
              selectedDate
                ? format(selectedDate, "dd MMMM yyyy", { locale: fr })
                : ""
            }
            className="flex-grow outline-none text-sm bg-transparent cursor-pointer"
          />
          <HiCalendar className="h-5 w-5 text-gray-400" />
        </div>

        {errorMessage && (
          <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
        )}

        {isOpen && (
          <div className="absolute z-20 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 w-full sm:w-72">
            {/* Quick select options */}
            {/* {showQuickDates && (
              <QuickDates
                options={quickDates}
                isDateDisabled={isDateDisabled}
                onDateSelect={handleDateChange}
              />
            )} */}

            {/* Calendar header */}
            <CalendarHeader
              currentDate={calendarDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              isPrevMonthDisabled={isPrevMonthDisabled}
              isNextMonthDisabled={isNextMonthDisabled}
            />

            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Day headers */}
              {["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"].map((day, i) => (
                <div key={i} className="text-xs font-medium text-gray-500 py-1">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {allDays.map((day, index) => {
                const isCurrentMonth = isSameMonth(day, calendarDate);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isDisabled = isDateDisabled(day);

                return (
                  <CalendarDay
                    key={index}
                    day={day}
                    isCurrentMonth={isCurrentMonth}
                    isSelected={Boolean(isSelected)}
                    isDisabled={isDisabled}
                    onClick={() => !isDisabled && handleDateChange(day)}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePicker;
