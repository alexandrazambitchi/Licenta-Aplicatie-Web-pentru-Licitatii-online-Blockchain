import React, { Component } from "react";
import ProductSoon from "./ProductSoon";
import "../App.css";

class ProductListSoonOnAuction extends Component {
  render() {
    return (
      //  className="p-2 flex-grow-1 bd-highlight"
      <div>
        {this.props.loading ? (
          <div id="loader" className="text-center">
            <p className="text-center">Loading...</p>
          </div>
        ) : (
          <div id="center">
            <p>&nbsp;</p>
            {(this.props.productsOnAuction === this.props.activeAuction) ? (
              <div className="d-flex">
                <div>
                  <h2 className="section-title">Soon on auction</h2>
                  <h3 className="section-title">No results</h3>
                </div>
              </div>
            ) : (
              <div className="d-flex">
                <div className="product-center">
                  <h2 className="section-title">Products</h2>
                  <h3 className="section-title">Soon on auction</h3>
                  {this.props.products.map((product, key) => {
                    return <ProductSoon key={key} {...product} />;
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default ProductListSoonOnAuction;
