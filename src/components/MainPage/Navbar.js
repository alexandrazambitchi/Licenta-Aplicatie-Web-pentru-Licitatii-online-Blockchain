import React, { Component } from 'react';
import { Link } from "react-router-dom";

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            House of Art
          </Link>
          <div className="collapse navbar-collapse" id="navbarColor01">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Home<span className="visually-hidden">(current)</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  About<span className="visually-hidden">(current)</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/activeauction">
                  Active Auctions
                  <span className="visually-hidden">(current)</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/soonauction">
                  Soon On Auction
                  <span className="visually-hidden">(current)</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/sold">
                  Ended Auction
                  <span className="visually-hidden">(current)</span>
                </Link>
              </li>
              <li className="nav-item">
                {this.props.admin ? (
                  <p>
                    <Link className="nav-link" to="/addproduct">
                      Add Product
                    </Link>
                  </p>
                ) : null}
              </li>
            </ul>
            <div>
              {this.props.admin ? (
                <span id="account">Account: admin</span>
              ) : (
                <span id="account">Account: {this.props.account}</span>
              )}
            </div>
          </div>
        </div>
      </nav>

      //
    );
  }
}

export default Navbar;
