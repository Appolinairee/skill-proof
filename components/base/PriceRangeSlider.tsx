import React, { useState, useEffect, useRef, useCallback } from "react";

interface PriceRangeSliderProps {
  minPrice: number;
  maxPrice: number;
  step?: number;
  onChange?: (values: { min: number; max: number }) => void;
  className?: string;
  value?: { min: number; max: number };
}

// Abbréviation de prix : 1k, 1.2M, etc.
export const abreviatePrice = (price: number): string => {
  if (price >= 1_000_000) return (price / 1_000_000).toFixed(1) + "M";
  if (price >= 1_000) return (price / 1_000).toFixed(0) + "k";
  return price.toString();
};

export const generateRanges = (
  min: number,
  max: number
): { label: string; min: number; max: number }[] => {
  const count = 6;
  const step = Math.ceil((max - min) / count);
  const ranges = [];

  for (let i = min; i < max; i += step) {
    const end = Math.min(i + step, max);
    ranges.push({
      label: `${abreviatePrice(i)} - ${abreviatePrice(end)}`,
      min: i,
      max: end,
    });
  }

  return ranges;
};

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  minPrice,
  maxPrice,
  step = 1000,
  onChange,
  className = "",
  value,
}) => {
  const [minValue, setMinValue] = useState(value?.min ?? minPrice);
  const [maxValue, setMaxValue] = useState(value?.max ?? maxPrice);
  const [isActive, setIsActive] = useState(false);
  const [activeThumb, setActiveThumb] = useState<"min" | "max" | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setMinValue(value.min);
      setMaxValue(value.max);
    }
  }, [value]);

  useEffect(() => {
    if (!value && onChange) {
      onChange({ min: minValue, max: maxValue });
    }
  }, [minValue, maxValue, onChange, value]);

  const getPercentage = (val: number) =>
    ((val - minPrice) / (maxPrice - minPrice)) * 100;

  const handleMouseDown =
    (thumb: "min" | "max") => (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      setIsActive(true);
      setActiveThumb(thumb);
    };

  const handleMouseUp = () => {
    setIsActive(false);
    setActiveThumb(null);
  };

  const handleMove = useCallback(
    (clientX: number) => {
      if (!sliderRef.current || !activeThumb) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const percent = Math.min(
        Math.max((clientX - rect.left) / rect.width, 0),
        1
      );
      let newValue =
        Math.round((minPrice + percent * (maxPrice - minPrice)) / step) * step;

      if (activeThumb === "min") {
        newValue = Math.min(newValue, maxValue - step);
        setMinValue(newValue);
      } else {
        newValue = Math.max(newValue, minValue + step);
        setMaxValue(newValue);
      }
    },
    [sliderRef, activeThumb, minPrice, maxPrice, step, minValue, maxValue]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isActive) handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isActive && e.touches.length) handleMove(e.touches[0].clientX);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isActive, activeThumb, minValue, maxValue, handleMove]);

  const handleKeyDown = (thumb: "min" | "max") => (e: React.KeyboardEvent) => {
    const increment = e.shiftKey ? 10 * step : step;
    let newValue = thumb === "min" ? minValue : maxValue;

    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        newValue = Math.max(newValue - increment, minPrice);
        break;
      case "ArrowRight":
      case "ArrowUp":
        newValue = Math.min(newValue + increment, maxPrice);
        break;
      case "Home":
        newValue = minPrice;
        break;
      case "End":
        newValue = maxPrice;
        break;
      default:
        return;
    }

    if (thumb === "min") {
      newValue = Math.min(newValue, maxValue - step);
      setMinValue(newValue);
    } else {
      newValue = Math.max(newValue, minValue + step);
      setMaxValue(newValue);
    }

    e.preventDefault();
  };

  const trackStyle = {
    left: `${getPercentage(minValue)}%`,
    width: `${getPercentage(maxValue) - getPercentage(minValue)}%`,
  };

  const pricesRanges = generateRanges(minPrice, maxPrice);

  const handleRangeSelect = (min: number, max: number) => {
    setMinValue(min);
    setMaxValue(max);
    if (onChange) {
      onChange({ min, max });
    }
  };

  return (
    <div className={className}>
      <div className="flex justify-between mb-2 text-sm text-gray-700 font-medium">
        <span>{abreviatePrice(minPrice)}</span>
        <span>{abreviatePrice(maxPrice)}</span>
      </div>

      <div
        ref={sliderRef}
        className="relative h-1 bg-gray-300 rounded-full mx-2"
        role="group"
        aria-labelledby="price-range-label"
      >
        <div
          className="absolute h-full bg-black rounded-full"
          style={trackStyle}
        />

        {/* Thumb Min */}
        <div
          role="slider"
          tabIndex={0}
          aria-valuemin={minPrice}
          aria-valuemax={maxPrice}
          aria-valuenow={minValue}
          aria-label="Prix minimum"
          style={{ left: `${getPercentage(minValue)}%` }}
          className="absolute top-1/2 w-[18px] h-[18px] -ml-2 -mt-[9px] bg-white border-2 border-gray-300 rounded-full shadow cursor-pointer z-20 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onMouseDown={handleMouseDown("min")}
          onTouchStart={handleMouseDown("min")}
          onKeyDown={handleKeyDown("min")}
        />

        {/* Thumb Max */}
        <div
          role="slider"
          tabIndex={0}
          aria-valuemin={minPrice}
          aria-valuemax={maxPrice}
          aria-valuenow={maxValue}
          aria-label="Prix maximum"
          style={{ left: `${getPercentage(maxValue)}%` }}
          className="absolute top-1/2 w-[18px] h-[18px] -ml-2 -mt-[9px] bg-white border-2 border-gray-300 rounded-full shadow cursor-pointer z-20 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onMouseDown={handleMouseDown("max")}
          onTouchStart={handleMouseDown("max")}
          onKeyDown={handleKeyDown("max")}
        />
      </div>

      <div className="flex scrollbar-none overflow-x-auto cach whitespace-nowrap gap-2 mt-6">
        {pricesRanges.map((range, index) => (
          <button
            key={index}
            className={`px-3 py-[6px] rounded-full cursor-pointer  transition-colors border border-gray-200 ${
              minValue === range.min && maxValue === range.max
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => handleRangeSelect(range.min, range.max)}
            aria-label={`Sélectionner la plage de prix ${range.label}`}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PriceRangeSlider;
