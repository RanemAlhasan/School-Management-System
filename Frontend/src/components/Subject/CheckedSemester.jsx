import React from "react";

function CheckedSemester({ name,value, handleClick, active}) {
  return (
    <div id="grade1" className={active ? "active" : ""} onClick={handleClick}>
      <label  >{value}</label>
    </div>
  );
}

export default CheckedSemester;
