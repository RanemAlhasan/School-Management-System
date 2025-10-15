import React, { Component } from "react";
import PrintingComponent from "../../PrintingComponents";

class TeacherScheduleTable extends Component {
  state = {};
  render() {
    return (
      <div className="common-schedule-table teacher-schedule">
        {this.props.schedule.map((day, index) => (
          <React.Fragment key={index}>
            {day.sessions.length !== 0 && (
              <h4
                className="day"
                style={{
                  backgroundColor: "#71d58e",
                  padding: "10px",
                  color: "#fff",
                }}
              >
                {day.name}
              </h4>
            )}
            {day.sessions.map((item) => (
              <React.Fragment
                key={`${item.startTime}-${item.endTime}-${index}`}
              >
                <p>
                  {item.startTime} - {item.endTime}
                </p>
                <p>
                  {item.classroom.className} - classroom number{" "}
                  {item.classroom.classroomNumber}
                </p>
                <p className="details">{item.subjectName}</p>
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </div>
    );
  }
}

export default PrintingComponent(TeacherScheduleTable);
