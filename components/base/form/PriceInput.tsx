import React, { useState, useEffect, useRef } from "react";
import Label from "./Label";
import { cn } from "@/utils/utils";

const PriceInputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    { label, name, errorMessage, required, className, register, icon, value, onChange, ...rest },
    ref
  ) => {
    const formatPrice = (value: string) => {
      return value.replace(/\D/g, "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
    };

    // State local pour la valeur affichée
    const [displayValue, setDisplayValue] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Synchroniser avec la prop value (Controller)
    useEffect(() => {
      if (value !== undefined) {
        setDisplayValue(formatPrice(value.toString()));
      } else if (rest.defaultValue && typeof rest.defaultValue === "string") {
        setDisplayValue(formatPrice(rest.defaultValue));
      }
    }, [value, rest.defaultValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target;
      const rawValue = input.value.replace(/\s/g, "");
      const selectionStart = input.selectionStart || 0;
      const spacesBefore = (
        input.value.slice(0, selectionStart).match(/\s/g) || []
      ).length;
      const formattedValue = formatPrice(rawValue);
      setDisplayValue(formattedValue);

      // Appeler onChange du Controller ou register
      if (onChange) {
        // pass an event-like object to satisfy React.ChangeEvent typing
        const syntheticEvent = { target: { value: rawValue } } as unknown as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      } else if (register) {
        // Laisser register gérer
      }

      // Correction du curseur après formatage
      setTimeout(() => {
        const inputEl = inputRef.current || input;
        if (inputEl) {
          let pos = 0,
            count = 0;
          while (
            count < selectionStart - spacesBefore &&
            pos < formattedValue.length
          ) {
            if (formattedValue[pos] !== " ") count++;
            pos++;
          }
          while (formattedValue[pos] === " ") pos++;
          inputEl.setSelectionRange(pos, pos);
        }
      }, 0);
    };

    const cleanValue = (value: string) => value.replace(/\s/g, "");

    return (
      <div className="mb-3">
        {label && (
          <Label title={label} htmlFor={name} icon={icon} required={required} />
        )}

        <input
          id={name}
          name={name}
          ref={(el) => {
            if (typeof ref === "function") ref(el);
            else if (ref)
              (ref as React.MutableRefObject<HTMLInputElement | null>).current =
                el;
            inputRef.current = el;
          }}
          {...rest}
          {...(register && !onChange ? register(name, {
            setValueAs: cleanValue,
            onChange: handleChange
          }) : {})}
          value={displayValue}
          onChange={handleChange}
          className={cn("input", errorMessage ? "input-error" : "", className)}
          inputMode="decimal"
        />

        {Boolean(errorMessage) && (
          <p className="input-error-message">{errorMessage}</p>
        )}
      </div>
    );
  }
);

PriceInputField.displayName = "PriceInputField";

export default PriceInputField;
