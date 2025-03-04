"use client";

import React, { useState, forwardRef, useRef, useEffect } from "react";
import clsx from "clsx";
import Image from "next/image";

interface DropdownProps<T> {
  label: string;
  options: T[];
  placeholder: string;
  onSelect: (value: string) => void;
  className?: string;
  className2?: string;
  className3?: string;
  showSearch?: boolean;
  id?: string;
  getLabel?: (option: T) => string;
  getSubLabel?: (option: T) => string;
}

const Dropdown = <T,>({
  label,
  options,
  placeholder,
  onSelect,
  className,
  className2,
  className3,
  showSearch,
  getLabel = (option) => String(option),
  getSubLabel = (option) => String(option),
  id,
}: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect(value);
    setIsOpen(false);
    setSearchTerm("");
  };

  const filteredOptions = options.filter((option) => {
    const label = getLabel(option);
    return label
      ? label.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
  });
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };
  const handleWindowBlur = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("click", handleClickOutside);
    window.addEventListener("blur", handleWindowBlur);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, []);

  return (
    <div ref={dropdownRef} className={clsx("relative opacity-100 ", className)}>
      {/* <label className="block text-gray-700 font-medium">{label}</label> */}
      <div
        className={clsx(
          "border rounded-full w-full inline-flex justify-between gap-2 px-2 p-1 cursor-pointer min-w-0",
          className2
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected || placeholder}{" "}
        <Image
          src={"/icons/filled_dropdown.svg"}
          width={20}
          height={20}
          alt=""
        />
      </div>
      {isOpen && (
        <div className="absolute  z-50 bg-black border border-gray-200 rounded mt-1 w-full shadow">
          {/* {showSearch === true && (
            <input
              className="w-full rounded-full px-2 focus:bg-blue-50 focus:rounded-full"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              //   placeholder="Search Airport"
            />
          )} */}
          <div className="bg-white max-h-[400px] gap-2 flex flex-col overflow-y-scroll">
            {filteredOptions.map((option, index) => (
              <div
                key={index}
                className={clsx(
                  `p-2  w-full   hover:bg-gray-100 cursor-pointer `,
                  className3
                )}
                onClick={() =>
                  handleSelect(getLabel ? getLabel(option) : (option as string))
                }
              >
                <h1 id={id}>
                  {getLabel ? getLabel(option) : (option as string)}{" "}
                  {getSubLabel && typeof option !== "string" && (
                    <span className="italic">{getSubLabel(option)}</span>
                  )}
                </h1>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      placeholder,
      type = "text",
      value,
      onClick,
      onChange,
      ...props
    },
    ref
  ) => {
    return (
      <input
        ref={ref}
        className={`border px-3 py-2 rounded ${className}`}
        placeholder={placeholder}
        type={type}
        value={value}
        onClick={onClick}
        onChange={onChange}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
