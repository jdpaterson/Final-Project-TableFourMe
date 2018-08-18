import React, { Fragment } from 'react';

const NavbarBrand = () => {
  return (
    <div className='navbar-brand'>

      <a className='navbar-item' href='/'>
        <img className='navbar-logo' id="nav-logo-size" src="/images/logo_1.png" alt="Logo created with LogoMkr http://logomakr.com" />
      </a>

    </div>
  );
};
const NavbarMenu = () => {
  // ADMIN BUTTON REMOVED FOR DEMO DAY
  return (
    <div className='navbar-menu'>
      {/* <a id="admin-button" className='button is-info' href='/admin'>
          <span className='icon'>
            <i className="fas fa-user" aria-hidden="true"></i>
          </span>
          <span>Admin</span>
        </a> */}
    </div>
  );
};

export default function Navbar() {
  return (
    <Fragment>
      <nav className='navbar' role='navigation' aria-label='main navigation'>
        <NavbarBrand />
        <NavbarMenu />
      </nav>
    </Fragment>
  );
}