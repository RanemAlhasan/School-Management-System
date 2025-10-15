import React from "react";
import Selection from "../Selection";

function ExamSet({
  subjects,
  handleDateChange,
  handleSubjectChange,
  handleTimeChange,
  date,
  startTime,
  endTime,
}) {
  return (
    <div className="exam-container">
      <h4>Exam Date</h4>
      <input
        type="date"
        placeholder="Exam Date"
        value={date}
        onChange={handleDateChange}
      />
      <div className="exam-set">
        <Selection data={subjects} handleSelect={handleSubjectChange} />
        <input
          type="time"
          name="startTime"
          value={startTime}
          onChange={handleTimeChange}
        />
        <input
          type="time"
          name="endTime"
          value={endTime}
          onChange={handleTimeChange}
        />
      </div>
    </div>
  );
}

export default ExamSet;
