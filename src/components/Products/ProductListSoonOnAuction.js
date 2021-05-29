import React, { Component } from "react";
import { Link } from "react-router-dom";
import ProductSoon from "./ProductSoon";
import "../App.css";

class ProductListSoonOnAuction extends Component {
  render() {
    return (
      //  className="p-2 flex-grow-1 bd-highlight"
      <div>
        <p>&nbsp;</p>

        {/* <h2>Product List</h2> */}
        {/* <section className="section"> */}
        {this.props.productsOnAuction < 1 ? (
          <h2 className="section-title">No results</h2>
        ) : (
          // <section className="section">
          <div className="d-flex">
            <div className="product-center">
              <h2 className="section-title">Products</h2>
              <h3 className="section-title">Soon on auction</h3>
              {this.props.products.map((product, key) => {
                return <ProductSoon key={key} {...product} />;
              })}
            </div>
          </div>
          // </section>
        )}
        {/* </section> */}
      </div>
    );
  }
}

export default ProductListSoonOnAuction;
