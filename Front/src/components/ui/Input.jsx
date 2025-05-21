import { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      name,
      type = "text",
      placeholder,
      error,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="form-control ">
        {label && (
          <label htmlFor={name} className="label">
            <span className="label-text">{label}</span>
          </label>
        )}
        <input
          ref={ref}
          type={type}
          name={name}
          id={name}
          placeholder={placeholder}
          className={`input input-bordered w-full ${
            error ? "input-error" : ""
          } ${className}`}
          {...props}
        />
        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
