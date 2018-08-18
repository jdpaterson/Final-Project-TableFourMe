import React, { Component } from 'react';

export default class StatusButton extends Component {
  constructor(props) {
    super(props);
  }

  createBtns = () => {
    const btnConfig = [
      { status: 'CHECK-IN', colorClass: 'is-success is-selected' },
      { status: 'CANCEL', colorClass: 'is-danger is-selected' }
    ];

    const btnGroup = btnConfig.map((config, index) => {
      const btnClass = `button is-small is-selected ${config.colorClass}`;
      return (
        <span
          key={index}
          data-key={this.props.id}
          id='rezo-button-width'
          onClick={event => this.props.selectBtn(event, config.status)}
          className={btnClass}
        >{config.status.toUpperCase()}</span>
      );
    });

    return btnGroup;
  }

  render() {
    return (
      <div className="buttons has-addons is-centered">
        {this.createBtns()}
      </div>
    );
  }
}