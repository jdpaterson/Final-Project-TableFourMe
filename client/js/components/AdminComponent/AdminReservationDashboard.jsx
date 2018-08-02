import React, { Component, Fragment } from 'react';
import StatusButton from './StatusButton.jsx';

// default table header
const createDefaultHeader = () => {
  return (
    <tr>
      <th>#</th>
      <th>SIZE</th>
      <th>NAME</th>
      <th>ORDERED?</th>
      <th>STATUS</th>
    </tr>
  );
};

export default class AdminReservationDashboard extends Component {
  selectBtn = (event, status) => {
    // get value of 'data-key' which is === primary key of reservation
    const id = event.target.getAttribute('data-key');
    // send the object to web socket
    this.props.socket.emit('updateReservationStatus', { id, status });
  }

  makeTable = reservations => {
    let sizeSum = 0;
    let index = 0;

    // loop through table rows
    const cells = reservations.map(reservation => {
      // only display reservation with status being 'waiting'
      if (reservation.status !== 'waiting') {
        return true;
      }

      // set row position
      const position = index + 1;

      // add the group size
      sizeSum += reservation.group_size;
      const { id, group_size, name, order_id, status } = reservation;

      const orderStatus = (order_id) ? (
        <span className="icon has-text-success">
          <i className="fas fa-check-square"></i>
        </span>
      ) : (
          <span className="icon has-text-danger">
            <i className="fas fa-times"></i>
          </span>
        );

      return (
        <tr key={id}>
          <td>{position}</td>
          <td>{group_size}</td>
          <td>{name}</td>
          <td>{orderStatus}</td>
          <td>
            <StatusButton id={id} status={status} selectBtn={this.selectBtn} />
          </td>
        </tr>
      )
    });

    let stats = `Total of ${reservations.length} groups (${sizeSum} people) waiting..`;

    return (
      <Fragment>
        <thead>
          <tr>
            <th colSpan='5'>{stats}</th>
          </tr>
          {createDefaultHeader()}
        </thead>
        <tbody>{cells}</tbody>
      </Fragment>
    );
  };

  render() {
    return (
      <table className='table is-striped is-hoverable is-fullwidth reservation-dashboard'>
        {this.makeTable(this.props.reservations)}
      </table>
    );
  }
}
