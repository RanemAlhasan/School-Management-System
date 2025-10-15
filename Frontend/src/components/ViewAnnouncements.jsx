import React from "react";

function ViewAnnouncements({ announcements, redirection }) {
  return (
    <div className="view-announcements">
      {announcements.map((element, index) => (
        <div className="announcements" key={index}>
          <p>{element.heading}</p>
          <button onClick={() => redirection(element)}>View</button>
        </div>
      ))}
    </div>
  );
}

export default ViewAnnouncements;
