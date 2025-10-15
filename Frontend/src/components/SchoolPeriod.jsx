import React from "react";
import Form from "./Form";
import Selection from "./Selection";
import PeriodContext from "../contexts/periodContext";

class SchoolPeriod extends Form {
  static contextType = PeriodContext;

  state = {
    data: [],
    heading: `${this.context.account.startYear} - ${this.context.account.endYear}`,
  };

  componentDidMount = () => {
    let thisYear = new Date().getFullYear();
    let data = [];
    for (let i = thisYear + 5; i > 2010; i--) {
      data.push(`${i - 1} - ${i}`);
    }
    this.setState({ data });
  };

  handleSelect = (element) => {
    let [startYear, endYear] = element.split(" - ");
    let account = { startYear, endYear };
    this.setState({ heading: element });
    sessionStorage.setItem("selectedYear", element);
    this.context.change(account);
  };

  render() {
    return (
      <div id="year">
        <h4>School period</h4>
        <div id="years">
          <Selection
            heading={this.state.heading}
            handleSelect={this.handleSelect}
            data={this.state.data}
          />
        </div>
      </div>
    );
  }
}

export default SchoolPeriod;
