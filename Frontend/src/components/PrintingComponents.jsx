import React, { Component } from "react";
import ReactToPrint from "react-to-print";

function PrintingComponent(Inner) {
  return class PrintingComponent extends Component {
    render() {
      return (
        <div>
          <ReactToPrint
            content={() => this.componentRef}
            trigger={() => (
              <button
                className="print"
                style={{ margin: "10px auto 0 auto", display: "block" }}
              >
                Print
              </button>
            )}
          />
          <Inner {...this.props} ref={(el) => (this.componentRef = el)} />
        </div>
      );
    }
  };
}

export default PrintingComponent;
