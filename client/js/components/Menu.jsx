import React, { Component, Fragment } from 'react';
import numeral from 'numeral';

export default class Menu extends Component {
  generateButton = menuItem => {
    return (
      <button
        onClick={event => this.props.addToOrder(menuItem)}
        className="button is-link"
        disabled={!this.props.reservation.id}
      >
        Add to order
      </button>
    );
  }

  generateMenu = () => {
    const { menuItems } = this.props.currentMenu;
    return menuItems.map(menuItem => {
      return (
        <section key={menuItem.id} className='card tile is-child box'>
          <main className="card-image">
            <img src={menuItem.img_url} alt={menuItem.name} />
          </main>
          <footer className="card-content">
            <p className="title is-6 has-text-centered">
              {menuItem.name} ({numeral(menuItem.price / 100).format('$0.00')})
            </p>
            <div className="content has-text-centered">
              {this.generateButton(menuItem)}
            </div>
          </footer>
        </section>
      );
    })
  }

  render() {
    return (
      <Fragment>
        {this.generateMenu()}
      </Fragment>
    );
  }
}
