import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import { namifyStr, getOnlyNumbers } from '../../libs/form-helper-func.js';

export default class BookingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        name: '',
        phone: '',
        group_size: '',
        email: '',
        res_code: ''
      },
      socket: '',
      btnType: ''
    };
  }

  // store the form button type in state (submit, update, cancel)
  btnClicked = btnType => {
    this.setState({ btnType });
  }

  // submit the form data
  handleFormSubmission = event => {
    // prevent default GET request
    event.preventDefault();
    // deconstruct event.target
    let { name, phone, group_size, email } = event.target;
    // deconstruct state object
    const { btnType, formData: { res_code } } = this.state;
    // send form data to websocket
    this.state.socket.emit(`${btnType}Reservation`, {
      name: namifyStr(name.value),
      phone: getOnlyNumbers(phone.value),
      group_size: group_size.value,
      email: email.value,
      res_code,
      host: process.env.HOST || window.location.host
    });
  }

  // add submit button for a new reservation or
  // add update and cancel buttons for an existing reservation
  addBtns = () => {
    let defaultBtnConfig = {};
    let cancelBtn = '';

    if (this.state.formData.res_code) {
      // CASE 1: res_code exists. show update and cancel buttons
      defaultBtnConfig = {
        type: 'update',
        klassName: 'button is-success'
      };
      cancelBtn = (
        <button
          type='submit'
          onClick={() => this.btnClicked('cancel')}
          className="button is-danger"
        >CANCEL</button>
      );
    } else {
      // CASE 2: res_code doesn't exist. show new buttons
      defaultBtnConfig = {
        type: 'submit',
        klassName: 'button is-link'
      };
    }

    let defaultBtn = (
      <button
        type='submit'
        onClick={() => this.btnClicked(defaultBtnConfig.type)}
        className={defaultBtnConfig.klassName}
      >{defaultBtnConfig.type.toUpperCase()}</button>
    );
    return { defaultBtn, cancelBtn };
  }

  // handle changes in input boxes
  handleChange = ({ target: { name, value } }) => {
    this.setState(oldState => {
      const { formData } = oldState;
      formData[name] = value;
      return { ...oldState, formData };
    })
  }

  componentDidMount = () => {
    // add formData to state
    const { socket, formData } = this.props;
    this.setState({ socket, formData });
  }

  // if updated props !== current state, then replace it with new props
  componentDidUpdate(prevProps, prevState) {
    const { formData } = this.props;
    if (prevState.formData !== formData) {
      this.setState({ formData });
    }
  }

  render() {
    const { name, phone, group_size, email } = this.state.formData;
    return (
      <form onSubmit={this.handleFormSubmission}>
        <div className='field'>
          <label className='label is-medium'>Name*</label>
          <div className='control has-icons-left has-icons-right'>
            <input
              className='input is-medium'
              value={name}
              onChange={this.handleChange}
              name='name'
              type='text'
              placeholder='Your name'
              required
            />
            <span className='icon is-medium is-left'>
              <i className='fas fa-user-alt'></i>
            </span>
            <span className='icon is-medium is-right'>
              <i className='fas fa-check fa-lg'></i>
            </span>
          </div>
        </div>

        <div className='field'>
          <label className='label is-medium'>Phone*</label>
          <div className='control has-icons-left has-icons-right'>
            <NumberFormat
              className='input is-medium'
              format='(###) ###-####'
              value={phone}
              onChange={this.handleChange}
              name='phone'
              type='tel'
              placeholder='(778) 123-4567'
              required
            />
            <span className='icon is-medium is-left'>
              <a className='button is-static'>
                +1
              </a>
            </span>
            <span className='icon is-medium is-right'>
              <i className='fas fa-check fa-lg'></i>
            </span>
          </div>
        </div>

        <div className='field'>
          <label className='label is-medium'>Group Size*</label>
          <div className='control has-icons-left has-icons-right'>
            <input
              className='input is-medium'
              value={group_size}
              onChange={this.handleChange}
              name='group_size'
              type='number'
              min='1'
              max='10'
              placeholder='e.g. 2'
              required
            />
            <span className='icon is-medium is-left'>
              <i className='fas fa-user-alt'></i>
            </span>
            <span className='icon is-medium is-right'>
              <i className='fas fa-check fa-lg'></i>
            </span>
          </div>
        </div>

        <div className='field'>
          <label className='label is-medium'>Email (optional)</label>
          <div className='control has-icons-left has-icons-right'>
            <input
              className='input is-medium'
              value={email}
              onChange={this.handleChange}
              name='email'
              type='email'
              placeholder='example@gmail.com'
            />
            <span className='icon is-medium is-left'>
              <i className='fas fa-envelope'></i>
            </span>
            <span className='icon is-medium is-right'>
              <i className='fas fa-check fa-lg'></i>
            </span>
          </div>
        </div>

        <div className="field is-centered is-grouped">
          <p className="control">
            {this.addBtns().defaultBtn}
          </p>
          <p className="control">
            {this.addBtns().cancelBtn}
          </p>
        </div>
      </form>
    );
  }
}
