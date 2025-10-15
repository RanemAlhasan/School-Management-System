import React from "react";
import StudentContext from "../../contexts/studentContext";
import Form from "../Form";

class SetMarkTable extends Form {
  static contextType = StudentContext;

  render = () => {
    let { header, body } = this.props;
    let { fullMark, handleFullMarkChange, handleStdMarkChange } = this.context;
    return (
      <table>
        <thead>
          <tr>
            {header.map((element) => (
              <th key={element}>{element}</th>
            ))}
            <th>
              {
                <input
                  onChange={handleFullMarkChange}
                  placeholder="Full Mark"
                  value={fullMark}
                  type="number"
                  style={{ color: fullMark <= 0 ? "red" : "" }}
                />
              }
            </th>
          </tr>
        </thead>
        <tbody>
          {body.map((element, index) => {
            return (
              <tr key={index}>
                <td>{element.name}</td>
                <td>
                  <input
                    type="number"
                    name={element.id}
                    placeholder="Mark"
                    value={element.mark}
                    onChange={handleStdMarkChange}
                    style={{
                      color:
                        parseInt(element.mark) < 0 ||
                          parseInt(element.mark) > parseInt(fullMark)
                          ? "red"
                          : "",
                    }}
                  />
                </td>
                <td>{fullMark <= 0 ? "Not Valid" : fullMark}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };
}

export default SetMarkTable;
