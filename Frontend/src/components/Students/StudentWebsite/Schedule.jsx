import React, { Component } from "react";
import PrintingComponent from "../../PrintingComponents";

class Schedule extends Component {
  render() {
    return (
      <div className="common-schedule-table">
        {this.props.schedule.map((day, index) => (
          <React.Fragment key={index}>
            <h4
              className="day"
              style={{
                backgroundColor: "#71d58e",
                padding: "10px",
                color: "#fff",
              }}
            >
              {day.dayName}
            </h4>
            {day.sessions.map((item) => (
              <React.Fragment
                key={`${item.startTime}-${item.endTime}-${index}`}
              >
                <p>
                  {item.startTime} - {item.endTime}
                </p>
                <p className="details">
                  {item.subjectName} - {item.teacher}
                </p>
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </div>
    );
  }
}

export default PrintingComponent(Schedule);
