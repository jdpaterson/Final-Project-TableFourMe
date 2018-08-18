import React, { Component } from 'react';

import ReservationDashboard from './UserComponent/ReservationDashboard.jsx';
import AdminReservationDashboard from './AdminComponent/AdminReservationDashboard.jsx';
import BookingForm from './BookingForm.jsx';

import Navbar from './Navbar.jsx';
import Order from './Order.jsx'
import Menu from './Menu.jsx';
import Category from './Category.jsx';
import * as formHelp from '../../libs/form-helper-func.js';
import { setSocket } from '../../../libs/cli-sock-setters.js';

export default class MainComponent extends Component {
  constructor(props) {
    super(props);
    const { blankCustomer, blankReservation, blankError } = formHelp;
    this.state = {
      currentCustomer: blankCustomer(),
      currentReservation: blankReservation(),
      reservations: [],
      currentMenu: {},
      menuItemOrders: [],
      res_code: props.res_code,
      tableLoading: true,
      err: blankError()
    };
  }

  setMenu = menu => {
    this.setState({ currentMenu: menu });
  }

  removeFromOrder = orderItem => {
    this.props.socket.emit('removeOrderItem', (orderItem));
  }

  addToOrder = menuItem => {
    menuItem.orderId = this.state.currentReservation.order.id;
    this.props.socket.emit('addItemToOrder', menuItem);
  }

  placeOrder = () => {
    this.props.socket.emit('placeOrder', this.state.currentReservation.order);
  }

  cancelOrder = () => {
    this.props.socket.emit('cancelOrder', this.state.currentReservation.order);
  }

  createBookingForm = (props, state) => {
    return (
      <div className='tile is-4 is-parent'>
        <article id='booking-form' className='tile is-child box'>
          <div className='content'>
            <div className='icon floaty-icon'>
              <i className="far fa-file-alt"></i>
            </div>
            <span className='title is-5'>BOOK A TABLE</span>
            <BookingForm
              res_code={state.res_code}
              urls={props.urls}
              socket={props.socket}
              err={state.err}
            />
          </div>
        </article>
      </div>
    );
  }

  createDashboard = state => {
    const { res_code, reservations, currentReservation, currentCustomer, tableLoading } = state;
    const dashBoard = (this.props.isAdmin) ? (
      <AdminReservationDashboard
        socket={this.props.socket}
        reservations={reservations}
        tableLoading={tableLoading}
      />
    ) : (
        <ReservationDashboard
          res_code={res_code}
          reservations={reservations}
          currentReservation={currentReservation}
          currentCustomer={currentCustomer}
          tableLoading={tableLoading}
        />
      );

    return (
      <div id="reservation-container" className='tile is-parent'>
        <article className='tile is-child box'>
          <div className='content'>
            <div className='icon floaty-icon'>
              <i className="far fa-clock"></i>
            </div>
            <span id="responsive-rezo-size" className='title is-5'>RESERVATION STATUS</span>
            {dashBoard}
          </div>
        </article>
      </div>
    );
  }

  createCategories = state => {
    if (state.menu) {
      return Object.values(state.menu).map(category => (
        <Category key={category.id} menu={category} setMenu={this.setMenu} />
      ));
    }
  }

  createMenu = state => {
    if (Object.keys(state.currentMenu).length > 0) {
      return (
        <article className='tile is-parent'>
          <div className='tile is-child box columns'>
            <Menu
              addToOrder={this.addToOrder}
              currentMenu={state.currentMenu}
              reservation={state.currentReservation}
            />
          </div>
        </article>
      );
    }
  }

  createOrderPage = state => {
    const { currentReservation, menuItemOrders, res_code } = this.state;
    if (currentReservation && res_code) {
      return (
        <div className='columns'>
          <div className='column'></div>
          <div className='column is-6'>
            <Order
              order={currentReservation.order}
              orderItems={menuItemOrders}
              removeFromOrder={this.removeFromOrder}
              placeOrder={this.placeOrder}
              cancelOrder={this.cancelOrder}
            />
          </div>
          <div className='column'></div>
        </div>
      );
    }
  }

  componentDidMount = () => {

    let { socket } = this.props;
    const { res_code } = this.state;
    socket = setSocket(socket, this);
    if (this.props.res_code) {
      socket.emit('getReservationByResCodeWithOrder', this.props.res_code);
      socket.emit('getItemOrdersWMenuItemByResCode', this.props.res_code);
      socket.emit('getCustomerByResCode', this.props.res_code);
    } else {
      if (this.state.res_code) {
        socket.emit('getReservationByResCode', res_code);
        socket.emit('getCustomerByResCode', res_code);
      }
    }

    socket.emit('getReservations');
    socket.emit('getMenu');
  }

  render() {
    return (
      <div className='container-page'>
        <div className='container is-desktop'>
          <header>
            <Navbar />
          </header>
          <br />
          <main>
            <div className='tile is-ancestor top-tile'>
              {this.createBookingForm(this.props, this.state)}
              {this.createDashboard(this.state)}
            </div>

            <div className='categories-row'>
              <div className='tile is-ancestor'>
                {this.createCategories(this.state)}
              </div>
            </div>

            <div className='tile is-ancestor'>
              {this.createMenu(this.state)}
            </div>

            {this.createOrderPage(this.state)}
          </main>
          <footer>
            <div className='footer-styling'></div>
          </footer>
        </div >
      </div>
    );
  }
}
