import React, { Component } from 'react';
import io from 'socket.io-client';

import Navbar from '../Navbar.jsx';
import ReservationDashboard from './ReservationDashboard.jsx';
import BookingForm from './BookingForm.jsx';
import Menu from './Menu.jsx';
import Order from './Order.jsx'

export default class MainArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io('http://localhost:3001'),
      res_code: '',
      order_id: '',
      orderItems: []
    };
  }

  getResCode = (resCode) => {
    this.setState({ res_code: resCode })
  }


  addToOrder = (menuItem) => {    
    fetch('/api/orders/1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(menuItem)
    })
    .then(response => {
      return response.json();
    })
    .then((newOrderItem) => {        
      this.setState((prevState, props) => {        
        let newItems = prevState.orderItems;   
        newItems.push(newOrderItem);             
        return {orderItems: newItems}
      });
    })
    .catch(err => { 
      console.log(err) 
    }); 
  }



  showRefId = () => {
    if (this.state.res_code) {
      return (
        <span className='subtitle is-5'>
          <em> - Reference ID: {this.state.res_code}</em>
        </span>
      );
    }
  };

  render() {
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
                    res_code={this.state.res_code}
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
                    urlParams={this.props.match.params}
                    getResCode={this.getResCode}
                    socket={this.state.socket}
                  />
                </div>
              </article>
            </div>
          </div>
          <div className='tile menu-tile is-4'>
            <Menu 
            addToOrder={this.addToOrder}
             />
          </div>
          <div className='tile order-tile is-4'>
            <Order 
            orderItems={this.state.orderItems}
            />
          </div>
        </main>
        <footer></footer>
      </div >
    );
  }
}
