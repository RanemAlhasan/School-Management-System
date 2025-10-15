import React, { Component } from "react";
import CrudList from "../../CrudList";
import { Redirect, Route, Switch } from "react-router-dom";
import PeriodContext from "../../../contexts/periodContext";
import ClassFees from "./ClassFees";
import ViewStudentPayments from "./ViewStudentPayments";
import AddPayment from "./AddPayment";

class Fees extends Component {
  static contextType = PeriodContext;

  redirectTo = () => {
    let type = this.props.match.params.type;
    if (!type)
      return (
        <Redirect to={`/school/${this.context.siteName}/Fees/Classesfees`} />
      );
    else
      return <Redirect to={`/school/${this.context.siteName}/Fees/${type}`} />;
  };

  render() {
    let type = this.props.match.params.type;
    return (
      <React.Fragment>
        <CrudList
          list={[
            "Classes fees",
            "Add student payment",
            "View student payments",
          ]}
          baseURL={`/school/${this.context.siteName}/Fees`}
          type={type}
        />
        <Switch>
          <Route path="/school/:name/Fees/Classesfees" component={ClassFees} />
          <Route
            path="/school/:name/Fees/Addstudentpayment"
            component={AddPayment}
          />
          <Route
            path="/school/:name/Fees/Viewstudentpayments"
            component={ViewStudentPayments}
          />
          {this.redirectTo()}
        </Switch>
      </React.Fragment>
    );
  }
}

export default Fees;
