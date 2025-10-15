import React from "react";

function SideList() {
  return (
    <React.Fragment>
      <label htmlFor="check-dashboard" id="sidebar">
        <i className="las la-list" />
      </label>
      <input type="checkbox" id="check-dashboard" />
    </React.Fragment>
  );
}

export default SideList;
