import React from "react";

function Days({ item, active, handleClick }) {
  return (
    <div onClick={handleClick} className={`item-day ${active ? "active" : ""}`}>
      {item}
    </div>
  );
}

export default Days;
