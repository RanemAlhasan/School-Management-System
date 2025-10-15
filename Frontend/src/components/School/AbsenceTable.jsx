import React, { Component } from "react";
import PrintingComponent from "../PrintingComponents";

class AbsenceTable extends Component {
  render() {
    return (
      <div>
        <table className="absence">
          <thead>
            <tr>
              <th colSpan="3">
                <i className="las la-clipboard-list" />
                {this.props.name}'s absence schedule
              </th>
            </tr>
            <tr className="tableHeader">
              <td>Reason</td>
              <td>Date</td>
            </tr>
          </thead>
          <tbody>
            {this.props.absences.map((element, index) => {
              return (
                <tr key={index}>
                  <td>{element.reason}</td>
                  <td>{element.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default PrintingComponent(AbsenceTable);
