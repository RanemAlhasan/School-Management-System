import React, { Component } from "react";
import PeriodContext from "../../../contexts/periodContext";
import { getDefaultValues } from "../../../services/defaultContextValues";
import { getStudentMarksReport } from "../../../services/marksServices";
import MarksReportTable from "../../Marks/MarksReportTable";

class StudentMarks extends Component {
  static contextType = PeriodContext;

  state = {
    marks: [],
  };

  componentDidMount = async () => {
    let type = this.props.parent ? "parent" : "student";

    let { account } = this.context;
    let newAccount = await getDefaultValues(account, type);

    let data = await getStudentMarksReport(newAccount, type);
    this.setState({ marks: data });
  };

  print = () => {
    window.print();
  };

  render() {
    let { marks } = this.state;
    return (
      <React.Fragment>
        <MarksReportTable marks={marks} />
      </React.Fragment>
    );
  }
}

export default StudentMarks;
