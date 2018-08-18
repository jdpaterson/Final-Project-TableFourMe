import React, { Component } from 'react';
import io from 'socket.io-client';

import Navbar from '../Navbar.jsx';
import ReservationDashboard from './ReservationDashboard.jsx';
import BookingForm from './BookingForm.jsx';
import Menu from './Menu.jsx';
import Order from './Order.jsx'

import { getAllReservations, returnResoArray } from '../../../libs/reservation-func.js';

export default class MainArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io('http://localhost:3001'),
      formData: {},
      reservations: [],
      order_id: 2,
      orderItems: []
    };
  }

  addToOrder = menuItem => {

    fetch(`/api/orders/${this.state.order_id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(menuItem)
    })
    .then(response => {
      console.log('insert', response)
      return response.json();
    })
    .then(newMenuItem => {
      console.log('NEWMENUITEM', newMenuItem)
      this.setState((prevState, props) => {
        console.log('neworderitem', newMenuItem)
        let newItems = prevState.orderItems;
        console.log(newItems)
        newItems.push(newMenuItem);
        return { orderItems: newItems }
      }, () => console.log(this.state.orderItems));
    })
    .catch(err => {
      console.log(err)
    });
  }

 removeFromOrder = (orderItem)=> {
  this.setState((prevState, props) => {
    delete prevState.orderItems[orderItem];
    return {
      prevState
    }
  })
  console.log("This.state on DELETE", this.state.orderItems, orderItem)
 }

  componentDidUpdate(prevProps, prevState, snapshot){
    console.log('MainPrevState: ', prevState);
    console.log('MainState: ', this.state);

  }

  componentDidMount = () => {
    fetch(`/api/orders/${this.state.order_id}/menu_items`)
      .then(response => {
        return response.json();
      })
      .then(menuItems => {
        this.setState({
          orderItems: menuItems
        })
      })

    // INITIAL RESERVATION DATA
    // get all reservations
    getAllReservations()
      .then(reservations => {
        // save all reservation data to state
        this.setState(oldState => {
          let currentReso = {};
          // receive res_code from url
          let { res_code } = this.props.match.params;
          // if re_code doesn't exist, set res_code to null
          if (res_code === '') {
            res_code = null;
          } else {
            // otherwise, filter the reservation with the param res_code
            currentReso = reservations.filter(reservation => reservation.res_code === res_code)[0];
          }

          if (currentReso) {
            const { name, phone, group_size, email } = currentReso;
            const formData = { name, phone, group_size, email, res_code };
            return { ...oldState, reservations, formData };
          } else {
            return { ...oldState, reservations };
          }
        });
      })
      .catch(err => { console.log(err) });

    // SOCKET CONNECTION
    // as customer submits the form, the form data's broadcast back here
    // add the new reservation data into the existing state
    const { socket } = this.state;
    socket.on('connect', () => {
      console.log('Connected to websocket');

      socket.on('news', newRecord => {
        // add all key-value pairs from newRecord
        const newReservation = { ...newRecord.customer, ...newRecord.reservation }
        this.setState(oldState => {
          const { name, phone, group_size, email, res_code } = newReservation;
          const formData = { name, phone, group_size, email, res_code };
          const reservations = returnResoArray(oldState.reservations, newReservation);
          return { ...oldState, formData, reservations };
        });
      });

      socket.on('newStatus', newStatus => {
        const { id, status } = newStatus;
        const reservations = this.state.reservations.map(reservation => {
          if (reservation.id == id) {
            reservation.status = status;
          }
          return reservation;
        });
        this.setState({ reservations });
      })
    });
  }

  showRefId = () => {
    const { res_code } = this.state.formData;
    if (res_code) {
      return (
        <span className='subtitle is-5'>
          <em> - Reference ID: {res_code}</em>
        </span>
      );
    }
  };

  render() {
    const { formData, reservations } = this.state;
    return (
      <div className='container is-desktop'>
        <header>
          <Navbar />
        </header>
        <br />
        <main>
          <div className='tile is-ancestor top-tile'>
            <div className='tile is-5 is-parent'>
              <article className='tile is-child box'>
                <div className='content'>
                  <span className='title is-4'>BOOK YOUR TABLE</span>
                  {this.showRefId()}
                  <BookingForm
                    formData={formData}
                    socket={this.state.socket}
                  />
                </div>
              </article>
            </div>
            <div className='tile is-parent'>
              <article className='tile is-child box'>
                <div className='content'>
                  <p className='title is-4'>RESERVATION STATUS</p>
                  <ReservationDashboard
                    formData={formData}
                    reservations={reservations}
                  />
                </div>
              </article>
            </div>
          </div>
          <div className='columns' >
            <div className='column is-one-third' />
            <div className='column is-one-third'>
              <Menu
              addToOrder={this.addToOrder}
               />
            </div>
            <div className='column is-one-third' />
            </div>
          <div className='tile order-tile is-4'>
            <Order
            orderId={this.state.order_id}
            orderItems={this.state.orderItems}
            removeFromOrder={this.removeFromOrder}
            />
          </div>
        </main>
        <footer></footer>
      </div >
    );
  }
}
