import React, { Component } from "react";
import PrintingComponent from "../PrintingComponents";

class MarksReportTable extends Component {
  render() {
    return (
      <div className="marks-report-table">
        {this.props.marks.map((element, first) => (
          <React.Fragment key={first}>
            <div className="semester-number">
              {element.semesterNumber === "1"
                ? "First Semester"
                : "Second Semester"}
            </div>
            {element.subjects.map((subject, index) => (
              <React.Fragment key={index}>
                <div className="subject-name">{subject.subjectName}</div>
                {subject.exams.map((exam, secondIndex) => (
                  <div className="mark-data" key={secondIndex}>
                    <p>
                      {exam.examType} - {new Date(exam.date).toDateString()}
                    </p>
                    <p>
                      Mark : {exam.mark}/{exam.fullMark}
                    </p>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </div>
    );
  }
}

export default PrintingComponent(MarksReportTable);
