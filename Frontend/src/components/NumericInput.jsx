import React from "react";
import Input from "./Input";

function NumericInput({ name, value, handleChange, placeholder }) {
  return (
    <div id="eye-container">
      <Input
        type="number"
        name={name}
        value={value}
        handleChange={handleChange}
        placeholder={placeholder}
        error={error}
      />
    </div>
  );
}

export default NumericInput;
