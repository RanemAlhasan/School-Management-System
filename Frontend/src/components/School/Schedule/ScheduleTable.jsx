import React from "react";
import Selection from "../../Selection";

function ScheduleTable({
  day,
  activeTimes,
  subjectsNames,
  handleSelectSubject,
  handleChangeSessionsNumber,
  handleSelectTeacher,
  sessionNumber,
  teachers,
}) {
  return (
    <React.Fragment>
      <h4 className="day">{day}</h4>
      <input
        type="number"
        min={1}
        placeholder="Sessions Number"
        onChange={handleChangeSessionsNumber}
        value={sessionNumber}
      />
      {activeTimes.map((time, index) => (
        <React.Fragment key={`${time}-${index}`}>
          <h4 className="time">{time}</h4>
          <div className="assign-time">
            <div>
              <h4>Select a subject</h4>
              <Selection
                data={subjectsNames}
                handleSelect={(subject) => handleSelectSubject(subject, time)}
                heading={subjectsNames.length === 0 ? "None" : "Subject Name ?"}
              />
            </div>
            <div>
              <h4>Select a teacher</h4>
              <Selection
                data={teachers}
                handleSelect={(teacher) => handleSelectTeacher(teacher, time)}
                heading={teachers.length === 0 ? "None" : "Teacher's Name ?"}
              />
            </div>
          </div>
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}

export default ScheduleTable;
