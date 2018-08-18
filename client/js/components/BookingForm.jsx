import React, { Component, Fragment } from 'react';
import NumberFormat from 'react-number-format';
import { blankReservation, blankCustomer, resoData } from '../../libs/form-helper-func.js';

export default class BookingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customer: blankCustomer(),
      reservation: blankReservation(),
    }
  }

  // ADD NEW RESERVATION - DO NOT CHANGE
  createReservation = () => {
    this.props.socket.emit('submitReservation', resoData(this.state));
  }

  // UPDATE EXISTING RESERVATION - DO NOT CHANGE
  updateReservation = () => {
    const { customer, reservation } = this.state;
    reservation.res_code = this.props.res_code;
    this.props.socket.emit('updateReservation', resoData({ customer, reservation }));
  }

  // CANCEL RESERVATION - DO NOT CHANGE
  cancelReservation = event => {
    event.preventDefault();
    const { res_code } = this.props;
    this.props.socket.emit('cancelReservation', { res_code });
  }

  // FORM SUBMISSION - DO NOT CHANGE
  handleSubmit = event => {
    event.preventDefault();
    const { res_code } = this.props;

    if (res_code) {
      this.updateReservation();
    } else {
      this.createReservation();
    }
  }

  // CREATE BUTTONS - DO NOT CHANGE
  submitButton = () => <button type='submit' className="button is-link" >SUBMIT</button>

  updateButton = () => <button type='submit' className="button is-info">UPDATE</button>

  cancelButton = () => <button onClick={this.cancelReservation} className="button is-danger">CANCEL</button>
  // CREATE BUTTONS - END

  // HANDLE CUSTOMER INPUTS - DO NOT CHANGE
  handleCustomerChange = ({ target: { name, value } }) => {
    this.setState(oldState => {
      const { customer } = oldState;
      customer[name] = value;
      return { customer };
    })
  }

  // HANDLE RESERVATION INPUTS - DO NOT CHANGE
  handleReservationChange = ({ target: { name, value } }) => {
    this.setState(oldState => {
      const { reservation } = oldState;
      reservation[name] = value;
      return { reservation };
    })
  }

  createEmailField = myEmail => {
    const emailIcons = (
      <Fragment>
        <span className='icon is-left'>
          <i className='fas fa-envelope'></i>
        </span>
        <span className='icon is-right'>
          <i className='fas fa-check fa-lg'></i>
        </span>
      </Fragment>
    );

    return (
      <Fragment>
        <label className='label'>Email</label>
        <div className='control has-icons-left has-icons-right'>
          <input
            className='input'
            value={myEmail}
            onChange={this.handleCustomerChange}
            name='email'
            type='email'
            placeholder='example@gmail.com'
          />
          {emailIcons}
        </div>
      </Fragment>
    );
  }

  createGroupSizeField = myGroupSize => {
    const groupSizeIcons = (
      <Fragment>
        <span className='icon is-left'>
          <i className='fas fa-user-alt'></i>
        </span>
        <span className='icon is-right'>
          <i className='fas fa-check fa-lg'></i>
        </span>
      </Fragment>
    );
    return (
      <Fragment>
        <label className='label'>Group Size (<i>required</i>)</label>
        <div className='control has-icons-left has-icons-right'>
          <input
            className='input'
            value={myGroupSize}
            onChange={this.handleReservationChange}
            name='group_size'
            type='number'
            min='1'
            max='10'
            placeholder='e.g. 2'
            required
          />
          {groupSizeIcons}
        </div>
      </Fragment>
    );
  }

  createPhoneField = myPhone => {
    const phoneIcons = (
      <Fragment>
        <span className='icon is-left'>
          <i className="fas fa-phone"></i>
        </span>
        <span className='icon is-right'>
          <i className='fas fa-check fa-lg'></i>
        </span>
      </Fragment>
    );
    return (
      <Fragment>
        <label className='label'>Phone (<i>required</i>)</label>
        <div className='control has-icons-left has-icons-right'>
          <NumberFormat
            className='input'
            format='(###) ###-####'
            value={myPhone}
            onChange={this.handleCustomerChange}
            name='phone'
            type='tel'
            placeholder='(778) 123-4567'
            required
          />
          {phoneIcons}
        </div>
        <p className="help is-danger">
          {(this.props.err.code == 21211) && this.props.err.message}
        </p>
      </Fragment>
    );
  }

  createNameField = myName => {
    const nameIcons = (
      <Fragment>
        <span className='icon is-left'>
          <i className='fas fa-user-alt'></i>
        </span>
        <span className='icon is-right'>
          <i className='fas fa-check fa-lg'></i>
        </span>
      </Fragment>
    );

    return (
      <Fragment>
        <label className='label'>Name (<i>required</i>)</label>
        <div className='control has-icons-left has-icons-right'>
          <input
            className='input'
            value={myName}
            onChange={this.handleCustomerChange}
            name='name'
            type='text'
            placeholder='Name'
            required
          />
          {nameIcons}
        </div>
      </Fragment>
    );
  }

  // DO NOT CHANGE
  componentDidMount() {
    const { socket, urls } = this.props;

    // check the url path
    if (urls.path === '/reservations/:res_code') {
      // if res_code is given as a url param, request customer and reservation
      // associated with the res_code and save them in state
      socket.emit('getCustomerByResCode', urls.params.res_code);
      socket.emit('getReservationByResCode', urls.params.res_code);
      socket.on('loadCustomer', customer => {
        this.setState({ customer });
      })
      socket.on('loadReservation', reservation => {
        this.setState({ reservation });
      })
    }
  }

  render() {
    const { customer: { name, phone, email } } = this.state;
    let group_size = this.state.reservation.group_size;
    return (
      <form className='booking-form' onSubmit={this.handleSubmit}>
        <div className='field'>
          {this.createNameField(name)}
        </div>
        <div className='field'>
          {this.createPhoneField(phone)}
        </div>
        <div className='field'>
          {this.createGroupSizeField(group_size)}
        </div>
        <div className='field'>
          {this.createEmailField(email)}
        </div>
        <div className="buttons is-centered is-grouped">
          <p className="control">
            {/*Button rendering depends on if reservation has been created*/}
            {this.props.res_code ? (this.updateButton()) : (this.submitButton())}
            {this.props.res_code && (this.cancelButton())}
          </p>
        </div>
      </form>
    );
  }
}
