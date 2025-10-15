import React from "react";
import errorPic from "../images/404.png";

function NotFound() {
  return (
    <div id="notfound">
      <img alt="not found" src={errorPic} />
    </div>
  );
}

export default NotFound;
