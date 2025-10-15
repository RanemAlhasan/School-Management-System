import React from "react";

function Grade({ name, value, handleClick, active }) {
  return (
    <div id="grade" className={active ? "active" : ""} onClick={handleClick}>
      <label htmlFor={name}>{value}</label>
    </div>
  );
}

export default Grade;
