import React, { Component } from "react";
import { Link } from "react-router-dom";
import AddProduct from "./AddProduct";
import ProductSoon from "./ProductSoon";
import "./App.css";

class ProductListSoonOnAuction extends Component {
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
          {this.props.productCount < 1 ? (
            <h2 className="section-title">No results</h2>
          ) : (
            <section className="section">
              <h2 className="section-title">Products</h2>
              <div className="product-center">
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

export default ProductListSoonOnAuction;
