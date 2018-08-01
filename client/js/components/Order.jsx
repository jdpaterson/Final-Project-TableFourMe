import React, { Component } from 'react';

export default class Order extends Component {
  
  
  render() {
    // console.log(`\n\n\n ${this.props.orderItems[0]}`);
    // console.log('Order is rendering');

    let positionCounter = 0;
    let totalPrice = 0;
    const orderItems = this.props.orderItems.map((item,index) => {
      totalPrice += item.price;
      
      return (
        <tr key={item.id}>
          <th>{index + 1}</th>
          <td><span className="listItemName">{item.name}</span></td>
          <td>{item.price}</td>
          <td className='remove-from-order'>
            <a className='button is-danger is-outlined is-small' onClick={() => {this.props.removeFromOrder(item)}}>
              <span>Remove</span>
              <span className='icon is-small'>
                <i className='fas fa-times'></i>
              </span>
            </a>
          </td>
        </tr>
      )
    });
  

    return (
      <article className='tile is-12 box'>
       <div className='content'>
          <p className='title is-4'>ORDER LIST</p>
          <table className="orderTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orderItems}
            </tbody>
            <tfoot>
              <tr>
                <th><abbr title="Position"></abbr></th>
                <th className='totalDescription'>Total to pay</th>
                <th>{totalPrice}</th>
                <th></th>
              </tr>
            </tfoot>  
          </table>
          <button className="button is-link">Place your order</button>
        </div>
      </article>
    )
  }
}

