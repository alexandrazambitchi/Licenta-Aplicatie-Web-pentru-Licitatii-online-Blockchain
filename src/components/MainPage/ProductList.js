import React, { Component } from 'react';
// import { Link } from "react-router-dom";
// import AddProduct from '../Products/AddProduct';
import Product from '../Products/Product';
// import ProductSoon from "../Products/ProductSoon";
// import "../App.css";
// import ProductListSoonOnAuction from '../Products/ProductListSoonOnAuction';

class ProductList extends Component {
  render() {
    return (
      //  className="p-2 flex-grow-1 bd-highlight"
      <div>
        <p>&nbsp;</p>

        {/* <h2>Product List</h2> */}
        {/* <section className="section"> */}
        {console.log("prodlist", this.props.activeAuction)}
        {this.props.activeAuction < 1 ? (
          <div className="d-flex">
            <div>
              <h2 className="section-title">Active auctions</h2>
              <h3 className="section-title">No results</h3>
            </div>
          </div>
        ) : (
          <div className="d-flex">
            <div className="product-center">
              <h2 className="section-title">Products</h2>
              <h3 className="section-title">Active auctions</h3>
              {this.props.products.map((product, key) => {
                return <Product key={key} {...product} text={"More"} />;
              })}
            </div>
          </div>
        )}
        {/* </section> */}
      </div>
    );
  }
}

export default ProductList;
