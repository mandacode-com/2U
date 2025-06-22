"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = {
  id: string;
  value: string;
  onChangeAction: (value: string) => void;
  required?: boolean;
  placeholder?: string;
};

export default function PasswordInput({
  id,
  value,
  onChangeAction,
  required = false,
  placeholder = "",
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  // Toggle visibility of the password
  const toggleVisibility = () => {
    setVisible((prev) => !prev);
  };

  return (
    <div className="relative w-full">
      <input
        type={visible ? "text" : "password"}
        id={id}
        value={value}
        onChange={(e) => onChangeAction(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="px-3 py-2 border rounded w-full"
      />
      <button
        type="button"
        onClick={toggleVisibility}
        className="absolute ml-2 px-2 py-1 bg-transparent right-0 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
        tabIndex={-1}
      >
        {visible ? <Eye size={20} /> : <EyeOff size={20} />}
      </button>
    </div>
  );
}
