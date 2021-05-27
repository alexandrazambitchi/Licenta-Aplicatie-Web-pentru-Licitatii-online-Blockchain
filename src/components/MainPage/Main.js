import React, { Component } from 'react';
import { Link } from "react-router-dom";
import AddProduct from '../Products/AddProduct';
import Product from '../Products/Product';
import ProductSoon from "../Products/ProductSoon";
// import "../App.css";
import ProductListSoonOnAuction from '../Products/ProductListSoonOnAuction';

class Main extends Component {

  render() {
    return (
      <div id="content">
        {this.props.admin ? (
          <p>
            <Link to="/addproduct">Add Product</Link>
          </p>
        ) : null}
        <p>&nbsp;</p>
        {/* <h2>Product List</h2> */}
        <section className="section">
          {this.props.productsOnAuction < 1 ? (
            <h2 className="section-title">No results</h2>
          ) : (
            <section className="section">
              {console.log(this.props.productsOnAuction)}
              <h2 className="section-title">Products</h2>
              <div className="product-center">
                <h3 className="section-title">Active auctions</h3>
                {this.props.products.map((product, key) => {
                  return <Product key={key} {...product} />;
                })}
              </div>
              <div className="product-center">
                <h3 className="section-title">Soon on auction</h3>
                {this.props.products.map((product, key) => {
                  return <ProductSoon key={key} {...product} />;
                })}
              </div>
            </section>
          )}
        </section>
      </div>
    );
  }
}

export default Main;
