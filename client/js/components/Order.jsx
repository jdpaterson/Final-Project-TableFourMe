import React, { Component } from 'react';
import numeral from 'numeral';

export default class Order extends Component {
  cancelOrderBtn = () => {
    return (
      <button
        className="button is-danger"
        onClick={() => { this.props.cancelOrder() }}
      >
        Cancel order
       </button>
    );
  }

  placeOrderBtn = () => {
    return (
      <button
        className="button is-link"
        onClick={() => { this.props.placeOrder() }}
      >
        Place order
      </button>
    );
  }

  createItemCancelBtn = orderItem => {
    const { order: { order_code }, removeFromOrder } = this.props;
    return (
      (order_code === 'nonce') && (
        <a
          className='button is-danger is-outlined is-small'
          onClick={() => { removeFromOrder(orderItem) }}
        >
          <span className='icon is-small'>
            <i className='fas fa-times'></i>
          </span>
        </a>
      )
    );
  }

  makeTBody = orderItems => {
    return orderItems.map((item, index) => {
      const integerToCurrency = numeral(item.price / 100).format('$0.00');
      return (
        <tr className="order-list-row" key={item.id}>
          <td>{index + 1}</td>
          <td>{item.name}</td>
          <td>{integerToCurrency}</td>
          <td className='remove-from-order'>
            {this.createItemCancelBtn(item)}
          </td>
        </tr>
      )
    });
  }

  makeTFoot = orderItems => {
    const totalPrice = orderItems.reduce((prev, curr) => prev + curr.price, 0);
    return (
      <tr className="order-list-row">
        <th><abbr title="Position"></abbr></th>
        <th className='totalDescription'>Total to pay</th>
        <th>{numeral(totalPrice / 100).format('$0.00')}</th>
        <th></th>
      </tr>
    );
  }

  makeOrderTable = selectedOrderItems => {
    const tHead = (
      <tr className="order-list-row" >
        <th>#</th>
        <th>NAME</th>
        <th>PRICE</th>
        <th></th>
      </tr>
    );

    return (
      <table className="orderTable table is-striped is-hoverable is-fullwidth">
        <thead>
          {tHead}
        </thead>
        <tbody>
          {this.makeTBody(selectedOrderItems)}
        </tbody>
        <tfoot>
          {this.makeTFoot(selectedOrderItems)}
        </tfoot>
      </table>
    );
  }

  render() {
    return (
      <article id='order-list' className='box'>
        <div >
          <div className='icon order-list-icon floaty-icon'>
            <i className="fas fa-utensils"></i>
          </div>
          <span className='order-list title is-4'>ORDER LIST</span>
          <div id="order-list-inner" >
            <div className="order-list-text">
              {this.makeOrderTable(this.props.orderItems)}
            </div>
            <br />
            <div className='has-text-centered'>
              {this.props.order && this.props.order.order_code === 'nonce' ?
                this.placeOrderBtn() : this.cancelOrderBtn()}
            </div>
          </div>
        </div>
      </article>
    )
  }
}
