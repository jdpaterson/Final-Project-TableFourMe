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

const showOrderStatus = order => {
  // ERROR HANDLING
  // IN CASE 'order' KEY DOESN'T EXIST IN RESERVATION, SKIP THIS FUNCTION RATHER THAN
  // MAKING THE WHOLE APP TO CRASH
  if (!order) {
    return true;
  }
  return (
    (order.order_code === 'nonce') ? (
      <span className="icon has-text-danger">N</span>
    ) : (
        <span className="icon has-text-success">Y</span>
      )
  );
}

export default class AdminReservationDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { tableLoading: true };
  }

  selectBtn = (event, status) => {
    // get value of 'data-key' which is === primary key of reservation
    const id = event.target.getAttribute('data-key');

    // send the object to web socket
    this.props.socket.emit('updateReservationStatus', { id, status });
  }

  makeTable = reservations => {
    // FIRST OF ALL, FILTER RESERVATIONS WITH STATUS OTHER THAN 'WAITING'
    reservations = reservations.filter(reso => reso.status === 'waiting');
    // LOOP THROUGH ROWS
    const cells = reservations.map((reservation, index) => {
      const { id, group_size, name, order, status } = reservation;
      return (
        <tr key={id}>
          <td>{index + 1}</td>
          <td>{group_size}</td>
          <td>{name}</td>
          <td>{showOrderStatus(order)}</td>
          <td>
            <StatusButton id={id} status={status} selectBtn={this.selectBtn} />
          </td>
        </tr>
      )
    });

    // CREATE STATISTICS
    const sizeSum = reservations.reduce((prev, curr) => prev + curr.group_size, 0);
    const stats = `Total of ${reservations.length} groups (${sizeSum} people) waiting..`;

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

  // ANNOUNCEMENT WHEN THERE IS NO ONE WAITING
  makeAnnouncement = () => <thead><tr><th>Book now and be our first customer!</th></tr></thead>

  addSpinner = () => {
    return (
      (this.state.tableLoading) && (
        <div className='has-text-centered'>
          <span>
            <i className="spinner fas fa-utensils fa-spin fa-2x"></i>  Loading table...
          </span>
        </div>
      )
    );
  }

  componentDidUpdate(prevProps, prevState) {
    // CHANGE THE TABLE LOADING STATUS
    if (this.props.tableLoading !== prevProps.tableLoading) {
      this.setState({ tableLoading: this.props.tableLoading });
    }
  }

  render() {
    const { reservations } = this.props;
    return (
      <Fragment>
        <div id="responsive-scroll">
        {this.addSpinner()}
        <table className='table is-striped is-hoverable is-fullwidth reservation-dashboard'>
          {(reservations.length > 0) ? this.makeTable(reservations) :
            this.makeAnnouncement()}
        </table>
        </div>
      </Fragment>
    );
  }
}
