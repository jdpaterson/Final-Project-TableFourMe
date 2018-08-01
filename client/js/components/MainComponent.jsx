import React, { Component } from 'react';

import Navbar from './Navbar.jsx';
import ReservationDashboard from './UserComponent/ReservationDashboard.jsx';
import BookingForm from './BookingForm.jsx';
import Order from './Order.jsx'
import Menu from './Menu.jsx';

import { returnResoArray } from '../../libs/reservation-func.js';

export default class MainComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: { name: '', phone: '', group_size: '', email: '', res_code: '' },
      reservations: [],
      orderId: '2',
      menuItemOrders: [],
    };
  }

  removeFromOrder = (orderItem)=> {
    const newState = this.state.menuItemOrders.filter(item => {
      return item.id !== orderItem.id;
    });

    this.setState((prevState) => {
      return { menuItemOrders: newState}
    })
    
  }


  addToOrder = menuItem => {
    fetch(`/api/orders/${this.state.order_id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(menuItem)
    })
      .then(response => response.json())
      .then(newMenuItem => {
        this.setState((prevState, props) => {
          let newItems = prevState.orderItems;
          newItems.push(newMenuItem);
          return { orderItems: newItems }
        })
      })
      .catch(err => { console.log(err); });
  }

  componentDidMount = () => {
    let { res_code, socket } = this.props;

    this.setState(oldState => {
      if (!res_code) { res_code = null; }
      oldState.formData.res_code = res_code;
      return oldState;
    })

    socket.on('connect', () => {
      console.log('Connected to websocket');

      // LOAD INITIAL RESERVATIONS
      socket.emit('getReservations');
      socket.on('loadReservations', reservations => {
        let formData = {};
        let currentReservation = [];
        if (res_code) {
          currentReservation = reservations.filter(reservation => res_code === reservation.res_code);
        }
        formData = (currentReservation.length === 0) ? this.state.formData : currentReservation[0];
        this.setState({ formData, reservations });
      });

      // LOAD NEW RESERVATIONS
      socket.on('loadNewReservation', newReservation => {
        this.setState(oldState => {
          const reservations = [...oldState.reservations, newReservation];
          return { ...oldState, formData: newReservation, reservations };
        });
      })

      // UPDATE RESERVATION DATA
      socket.on('loadChangedReservation', newReservation => {
        this.setState(oldState => {
          const reservations = returnResoArray(oldState.reservations, newReservation);
          return { ...oldState, formData: newReservation, reservations };
        });
      })

      // CANCEL RESERVATION
      socket.on('removeCancelledReservation', newData => {
        this.setState(oldState => {
          const reservations = returnResoArray(oldState.reservations, newData);

          return {
            ...oldState,
            formData: { name: '', phone: '', group_size: '', email: '', res_code: '' },
            reservations
          };
        });
      })

      // socket.on('newStatus', newStatus => {
      //   const { id, status } = newStatus;
      //   const reservations = this.state.reservations.map(reservation => {
      //     if (reservation.id == id) {
      //       reservation.status = status;
      //     }
      //     return reservation;
      //   });
      //   this.setState({ reservations });
      // });


      socket.emit('getItemOrdersWMenuItemInfo');
      socket.on('ItemOrdersWMenuItemInfo', menuItemOrders => {
        this.setState({ menuItemOrders });
      });

      socket.on('NewOrderAdded', data => {
        //SET STATE TO ADD ORDER TO ORDER ARRAY
      });

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
                    socket={this.props.socket}
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
          <div className='columns' >
            <div className='column is-one-third' />
            <div className='column is-one-third'>
              <Order
                orderId="2"
                orderItems={this.state.menuItemOrders}
                removeFromOrder={this.removeFromOrder}
              />
            </div>
            <div className='column is-one-third' />
          </div>
        </main>
        <footer></footer>
      </div >
    );
  }
}
