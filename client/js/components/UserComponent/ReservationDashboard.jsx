import React, { Component, Fragment } from "react";

const createTHead = statistics => {
  return (
    <Fragment>
      <tr>
        <th colSpan="3">{statistics}</th>
      </tr>
      <tr>
        <th>#</th>
        <th>NAME</th>
        <th>SIZE</th>
      </tr>
    </Fragment>
  );
};

export default class ReservationDashboard extends Component {
  constructor(props) {
    super(props);
    let res_code = '';
    if (this.props.res_code) {
      res_code = this.props.res_code;
    }
    this.state = {
      res_code,
      tableLoading: true
    };
  }

  makeTable = (reservations, res_code) => {
    // FIRST OF ALL, FILTER RESERVATIONS WITH STATUS OTHER THAN 'WAITING'
    reservations = reservations.filter(reso => reso.status === 'waiting');

    // CURRENT RESERVATION
    // GET INDEX OF CURRENT RESERVATION
    const myResoIndex = reservations.findIndex(reso => reso.res_code === res_code);
    // SAVE THE CURRENT RESERVATION ARRAY ITEM AS A VAR
    const myReso = reservations[myResoIndex];
    // IF RES_CODE EXISTS, THEN CREATE DOM FOR THE CURRENT RESERVATION
    const myResoCell = (myResoIndex !== -1) && (
      <tr key={myResoIndex + 1} className='is-selected'>
        <td>{myResoIndex + 1}</td>
        <td>{myReso.name}</td>
        <td>{myReso.group_size}</td>
      </tr>
    );
    // CURRENT RESERVATION - END

    // ALL OTHER RESERVATIONS
    // GET TOP 5 OF ALL OTHER RESERVATIONS (EXCEPT FOR THE CURRENT RESERVATION)
    const allOtherTop5 = reservations.filter(reso => reso.res_code !== res_code).slice(0, 5);
    // CREATE DOM FOR ALL THE OTHER RESERVATIONS
    const allOtherTop5Cells = allOtherTop5.map((reso, index) => {
      const position = (myResoIndex === -1 || myResoIndex > index) ? index + 1 : index + 2;

      return (
        <tr key={position} className=''>
          <td>{position}</td>
          <td>{reso.name}</td>
          <td>{reso.group_size}</td>
        </tr>
      );
    });

    // SINCE WE'RE SHOWING THE TOP 5 AND THE CURRENT RESERVATION, ADD A ROW SHOWING "..."
    // TO LET CUSTOMERS SHOW THERE ARE OMITTED ROWS
    if (myResoIndex !== 5 && reservations.length > 5) {
      allOtherTop5Cells.push(
        <tr key='filler' className=''>
          <td colSpan='5'>- - - - - - - - - - - - - - - - - - - -</td>
        </tr>
      );
    }

    // PUT THE CURRENT RESERVATION BACK TO THE OTHER RESERVATION DOM ARRAY
    allOtherTop5Cells.splice(myResoIndex, 0, myResoCell);

    // CREATE STATISTICS
    const sizeSum = reservations.reduce((prev, curr) => prev + curr.group_size, 0);
    const stats = (res_code) ? `You are in Position: #${myResoIndex + 1}` : `Total of ${reservations.length} groups (${sizeSum} people) waiting..`;

    return (
      <Fragment>
        <thead>
          {createTHead(stats)}
        </thead>
        <tbody>
          {allOtherTop5Cells}
        </tbody>
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
    // ONCE RES_CODE IN YOUR STATE IS ASSIGNED TO A RES_CODE, THEN DON'T UPDATE IT ANY MORE.
    if (this.props.res_code && prevProps.res_code === null) {
      this.setState({ res_code: this.props.res_code });
    }
    // CHANGE THE TABLE LOADING STATUS
    if (this.props.tableLoading !== prevProps.tableLoading) {
      this.setState({ tableLoading: this.props.tableLoading });
    }
  }

  render() {
    const { reservations } = this.props;
    return (
      <Fragment>
        {this.addSpinner()}
        <table className="table is-striped is-hoverable is-fullwidth reservation-dashboard">
          {(reservations.length > 0) ?
            this.makeTable(reservations, this.state.res_code) :
            this.makeAnnouncement()}
        </table>
      </Fragment>
    );
  }
}
