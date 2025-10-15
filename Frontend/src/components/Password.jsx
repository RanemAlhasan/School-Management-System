import React, { Component } from "react";
import Input from "./Input";

class Password extends Component {
  state = { opened: true, type: "password" };

  handleEye = () => {
    let opened = !this.state.opened;
    let type = opened ? "password" : "text";
    this.setState({ opened, type });
  };

  determineClasses = () => {
    let className = "las la-eye";
    let rest = this.state.opened ? className : (className += "-slash");
    return rest;
  };

  render() {
    return (
      <div id="eye-container">
        <Input
          type={this.state.type}
          name={this.props.name}
          value={this.props.value}
          handleChange={this.props.handleChange}
          placeholder={this.props.placeholder}
          isPassword="password"
          error={this.props.error}
        />
        <div className="eye" onClick={this.handleEye}>
          <i className={this.determineClasses()} />
        </div>
      </div>
    );
  }
}

export default Password;
