import React, { Component } from 'react';
import { Link } from "react-router-dom";
// import AddProduct from '../Products/AddProduct';
import Product from '../Products/Product';
// import ProductSoon from "../Products/ProductSoon";
// import "../App.css";
// import ProductListSoonOnAuction from '../Products/ProductListSoonOnAuction';

class ProductList extends Component {
  render() {
    return (
      <div className="p-2 flex-grow-1 bd-highlight">
        <p>&nbsp;</p>
        {/* <h2>Product List</h2> */}
        <section className="section">
          {this.props.productsOnAuction < 1 ? (
            <h2 className="section-title">No results</h2>
          ) : (
            <section className="section">
              <h2 className="section-title">Products</h2>
              <h3 className="section-title">Active auctions</h3>
              <div className="product-center">
                {this.props.products.map((product, key) => {
                  return <Product key={key} {...product} text={"More"} />;
                })}
              </div>
            </section>
          )}
        </section>
      </div>
    );
  }
}

export default ProductList;
