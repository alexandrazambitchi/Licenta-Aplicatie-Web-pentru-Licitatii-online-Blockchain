import React, { Component } from "react";
import ProductSold from "./ProductEnded";
import "../App.css";

class Sold extends Component {
  render() {
    return (
      <div>
        {this.props.loading ? (
          <div id="loader" className="text-center">
            <p className="text-center">Loading...</p>
          </div>
        ) : (
          <div>
            <p>&nbsp;</p>
            {console.log("active auction", this.props.activeAuction)}
            {console.log("products on auction", this.props.productsOnAuction)}
            {console.log("product count", this.props.productCount)}
            {console.log("auction count", this.props.auctionCount)}
            {(this.props.productCount - this.props.productsOnAuction) === 0 ? (
              <div className="text-center">
                <h2 className="section-title text-center">Sold products</h2>
                <h3 className="section-title text-center">No results</h3>
              </div>
            ) : (
              // <div>
              <div className="product-center">
                <h2 className="section-title text-center">Products</h2>
                <h3 className="section-title text-center">Sold</h3>
                <div className="grid-container">
                  {this.props.products.map((product, key) => {
                    if (product.auction_ended) {
                      return <ProductSold key={key} {...product} />;
                    }
                  })}
                </div>
              </div>
              // </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Sold;