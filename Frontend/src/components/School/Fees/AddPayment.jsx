import React, { Component } from "react";
import { getStudentsAnnouncements } from "../../../services/announcementsService";
import PeriodContext from "../../../contexts/periodContext";
import Selection from "../../Selection";
import { toast, ToastContainer } from "react-toastify";
import Date from "../../Date";
import { sendStudentPayment } from "../../../services/studentService";

class AddPayment extends Component {
  static contextType = PeriodContext;

  state = {
    students: [],
    selectedStudent: "",

    payment: "",
    date: "",
  };

  componentDidMount = async () => {
    let students = await getStudentsAnnouncements(
      this.context.account,
      this.context.siteName
    );
    this.setState({
      students,
      selectedStudent: students[0] ? students[0].studentId : "",
    });
  };

  handleSelectStudent = (selectedStudent) => {
    let { students } = this.state;
    let studentId = students.find(
      (element) => element.name === selectedStudent
    ).studentId;
    this.setState({ selectedStudent: studentId, payment: "" });
  };

  handlePaymentChange = ({ currentTarget }) => {
    this.setState({ payment: currentTarget.value });
  };

  setClassFee = async () => {
    let { selectedStudent, date, payment } = this.state;
    let { siteName, account } = this.context;
    if (payment <= 0 || !payment) {
      toast.error("Payment must be larger than zero");
      return;
    }
    if (!date) {
      toast.error("Payment date must be specified");
      return;
    }
    try {
      await sendStudentPayment(
        siteName,
        account,
        selectedStudent,
        payment,
        date
      );
      toast.success("Student's payment has been set successfully");
    } catch (error) {}
  };

  handlePaymentDate = ({ currentTarget }) => {
    this.setState({ date: currentTarget.value });
  };

  render() {
    let { students, payment, date } = this.state;
    let studentsNames = students.map((element) => element.name);

    return (
      <div className="fees">
        <ToastContainer />
        <Selection
          data={studentsNames}
          handleSelect={this.handleSelectStudent}
        />
        <input
          type="number"
          placeholder="Payment Amount"
          value={payment}
          min={0}
          onChange={this.handlePaymentChange}
        />
        <Date
          value={date}
          placeholder="Payment Date"
          handleChange={this.handlePaymentDate}
          name="date"
        />
        <button onClick={this.setClassFee}>Set Payment</button>
      </div>
    );
  }
}

export default AddPayment;
