import React from "react";
import "./FormBody.css";

export default function Form({ onChange, formValues }) {
  return (
    <>
      {formValues.map((input) => (
        <label htmlFor={input.forLabel}>
          {input?.label}
          <input
            className="form-control"
            type={input.type}
            value={input.value}
            name={input.name}
            defaultValue={input?.defaultValue}
            onChange={onChange}
            placeholder={input.placeholder}
          />
        </label>
      ))}
    </>
  );
}
