import React, { Component } from "react";
import { getClassesAnnouncements } from "../../../services/announcementsService";
import PeriodContext from "../../../contexts/periodContext";
import Selection from "../../Selection";
import { sendClassFee } from "../../../services/classesService";
import { toast, ToastContainer } from "react-toastify";

class ClassFees extends Component {
  static contextType = PeriodContext;

  state = {
    classes: [],
    selectedClass: "",

    classFee: "",
  };

  componentDidMount = async () => {
    let { account, siteName } = this.context;
    let classes = await getClassesAnnouncements(account, siteName);
    this.setState({
      classes,
      selectedClass: classes[0] ? classes[0].schoolClassId : "",
    });
  };

  handleSelectClass = (selectedClass) => {
    let { classes } = this.state;
    let classId = classes.find(
      (element) => element.className === selectedClass
    ).schoolClassId;
    this.setState({ selectedClass: classId, classFee: "" });
  };

  handleFeeChange = ({ currentTarget }) => {
    this.setState({ classFee: currentTarget.value });
  };

  setClassFee = async () => {
    let { selectedClass, classFee } = this.state;
    let { siteName, account } = this.context;
    if (classFee < 0 || !classFee) {
      toast.error("Class fee must be larger or equal to zero");
      return;
    }
    try {
      await sendClassFee(siteName, account, selectedClass, classFee);
      toast.success("Fee has been set successfully");
    } catch (error) {}
  };

  render() {
    let { classes, classFee } = this.state;
    let classesNames = classes.map((element) => element.className);

    return (
      <div className="fees">
        <ToastContainer />
        <Selection data={classesNames} handleSelect={this.handleSelectClass} />
        <input
          type="number"
          placeholder="Class Fee"
          value={classFee}
          min={0}
          onChange={this.handleFeeChange}
        />
        <button onClick={this.setClassFee}>Set Fee</button>
      </div>
    );
  }
}

export default ClassFees;
