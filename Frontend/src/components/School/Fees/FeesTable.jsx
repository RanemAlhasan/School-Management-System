import React, { Component } from "react";
import PrintingComponent from "../../PrintingComponents";

class FeesTable extends Component {
  render() {
    let sum = 0;
    let { payments } = this.props;
    if (!payments.payments) return null;
    return (
      <div className="payments">
        <table>
          <thead>
            <tr>
              <th>Payment Amount</th>
              <th>Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.payments.map((element, index) => {
              sum += element.value;
              return (
                <tr key={index}>
                  <td>{element.value}</td>
                  <td>{new Date(element.date).toDateString()}</td>
                </tr>
              );
            })}
            <tr className="calculation">
              <th>Total fee</th>
              <td>{payments.schoolClass.fees}</td>
            </tr>
            <tr className="calculation">
              <th>Total payments amount</th>
              <td>{sum}</td>
            </tr>
            <tr className="remaining">
              <th>Remaining amount</th>
              <td>
                {payments.schoolClass.fees - sum < 0
                  ? 0
                  : payments.schoolClass.fees - sum}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default PrintingComponent(FeesTable);
