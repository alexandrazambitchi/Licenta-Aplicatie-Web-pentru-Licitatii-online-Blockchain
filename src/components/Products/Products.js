import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../App.css";

class Products extends Component{
  render() {
    return (
      <div id="content">
        {this.props.loading ? (
          <div id="loader" className="text-center">
            <p className="text-center">Loading...</p>
          </div>
        ) : (
          <div>
            <h3>Dicover product that are already on auction</h3>
            <Link to="/activeauction">
              <h3>See more</h3>
            </Link>
            <p></p>
            <h3>Dicover product that are going to be soon on auction</h3>
            <Link to="/soonauction">
              <h3>See more</h3>
            </Link>
            <p></p>
            <h3>Dicover product that have already been sold</h3>
            <Link to="/sold">
              <h3>See more</h3>
            </Link>
            <p></p>
          </div>
        )}
      </div>
    );
  }
}

export default Products;