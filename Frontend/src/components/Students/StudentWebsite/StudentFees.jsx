import React, { useContext, useEffect, useState } from "react";
import { getDefaultValues } from "../../../services/defaultContextValues";
import { studentWebsitePayments } from "../../../services/studentService";
import PeriodContext from "../../../contexts/periodContext";
import FeesTable from "../../School/Fees/FeesTable";

function StudentFees({ parent }) {
  let [payments, setPayments] = useState([]);
  let { account } = useContext(PeriodContext);

  useEffect(() => {
    async function getPayments() {
      let type = parent ? "parent" : "student";
      let newAccount = await getDefaultValues(account, type);
      let payments = await studentWebsitePayments(newAccount, type);
      setPayments(payments);
    }
    getPayments();
  }, [account, parent]);
  return (
    <div id="student-fees">
      <FeesTable payments={payments} />
    </div>
  );
}

export default StudentFees;
