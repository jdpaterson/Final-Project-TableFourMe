import React, { Component, Fragment } from 'react';

// default table header
const createDefaultHeader = () => {
  return (
    <tr>
      <th>#</th>
      <th>NAME</th>
      <th>SIZE</th>
      <th></th>
    </tr>
  );
};

export default class ReservationDashboard extends Component {
  makeTable = (reservations, res_code) => {
    // set sizeSum to 0 before calculating how many people are ahead of the current customer
    let sizeSum = 0;
    let index = 0;
    let stats = '';
    let options = '';

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

      // current customer's reservation exists in the reservation table
      if (res_code == reservation.res_code) {
        // create stats for the current reservation
        stats = `Your position: #${position} (${sizeSum - reservation.group_size} people ahead)`;

        // option for the selected reservation
        options = (
          <a className='button is-link is-rounded is-small'>
            <span>Place Order</span>
            <span className='icon is-small'>
              <i className="fas fa-cart-arrow-down"></i>
            </span>
          </a>
        );
      } else {
        options = '';
      }


      const visibleRowCut = 3;
      let { name, group_size } = reservation;
      const klassName = (res_code == reservation.res_code) ? 'is-selected' : '';
      name = (res_code == reservation.res_code) ? name : '...';

      let row = '';
      if (index < visibleRowCut) {
        // first 3 rows
        row = (
          <tr key={reservation.id} className={klassName}>
            <td>{position}</td>
            <td>{name}</td>
            <td>{group_size}</td>
            <td>{options}</td>
          </tr>
        );
      } else if (res_code == reservation.res_code) {
        // current customer's reservation row
        row = (
          <tr key={reservation.id} className={klassName}>
            <td>{position}</td>
            <td>{name}</td>
            <td>{group_size}</td>
            <td>{options}</td>
          </tr>
        )
      } else if (index == visibleRowCut) {
        row = (
          <tr key='empty_row'>
            <td colSpan='4'>...</td>
          </tr>
        );
      }

      index++;
      return row;
    });

    if (!res_code) {
      // display total number of groups and people in the que
      stats = `Total of ${reservations.length} groups (${sizeSum} people) waiting..`;
    }

    return (
      <Fragment>
        <thead>
          <tr>
            <th colSpan='4'>{stats}</th>
          </tr>
          {createDefaultHeader()}
        </thead>
        <tbody>
          {cells}
        </tbody>
      </Fragment>
    );
  };

  render() {
    // console.log(this.props);
    const { reservations, formData: { res_code } } = this.props;
    return (
      <table className='table is-striped is-hoverable is-fullwidth reservation-dashboard'>
        {this.makeTable(reservations, res_code)}
      </table>
    );
  }
}
