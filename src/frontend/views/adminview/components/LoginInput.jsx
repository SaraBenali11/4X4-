import React from "react";

export default function LoginInput({
  label,
  type,
  value,
  onChange,
  error,
  placeholder,
}) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? "error" : ""}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}
