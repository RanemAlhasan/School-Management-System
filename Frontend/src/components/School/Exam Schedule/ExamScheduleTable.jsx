import React, { Component } from "react";
import PrintingComponent from "../../PrintingComponents";

class ExamScheduleTable extends Component {
  render() {
    return (
      <div id="exam-schedule">
        <div className="multiple-exam">
          {this.props.schedule &&
            this.props.schedule.map((element, index) => (
              <div className="exam-container" key={index}>
                <h4
                  syle={{
                    textAlign: "center",
                    color: "#000",
                  }}
                >
                  {element.date}
                </h4>
                <div className="exam-set exam-view">
                  <p>{element.subject}</p>
                  <p>{element.time}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }
}

export default PrintingComponent(ExamScheduleTable);
