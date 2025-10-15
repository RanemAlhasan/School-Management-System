import React, { useContext } from "react";
import StudentContext from "../../contexts/studentContext";

function GetMarksTable({ students, handleMarkSort, handleNameSort }) {
  let { headers, fullMark } = useContext(StudentContext);

  return (
    <table>
      <thead>
        <tr>
          <th onClick={handleNameSort}>
            {headers[0]}
            <i className="las la-sort-down sort" />
          </th>
          <th onClick={handleMarkSort}>
            {headers[1]} <i className="las la-sort-down sort" />
          </th>
          <th>{headers[2]}</th>
        </tr>
      </thead>
      <tbody>
        {students.map((element, index) => (
          <tr key={index}>
            <td>{element.name}</td>
            <td>{element.mark}</td>
            <td>{fullMark}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default GetMarksTable;
