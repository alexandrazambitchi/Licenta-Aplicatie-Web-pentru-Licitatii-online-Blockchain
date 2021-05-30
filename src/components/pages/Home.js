import React, { Component } from "react";
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import Web3 from "web3";
import "../App.css";
// import AuctionHouse from "../../abis/AuctionHouse.json";
// import Navbar from "../MainPage/Navbar";
import ProductList from "../Products/ProductList";
// import AddProduct from "../Products/AddProduct";
// import { Link } from "react-router-dom";
// import SearchForm from "../MainPage/SearchForm"
// import Carousel from "react-bootstrap/Carousel";
import CarouselFile from "../MainPage/CarouselFile";
import ProductListSoonOnAuction from "../Products/ProductListSoonOnAuction";

class Home extends Component {
  render() {
    return (
      <div className="container-fluid mt-5">
        {/* <div className="row"> */}
        {/* <main role="main" className="col-lg-12 d-flex"> */}
        {this.props.loading ? (
          <div id="loader" className="text-center">
            <p className="text-center">Loading...</p>
          </div>
        ) : (
          <div className="center">
            <CarouselFile />
            <div className="d-flex">
              {/* <SearchForm
                  productCount={this.props.productCount}
                  products={this.props.products}
                /> */}

              <ProductList
                admin={this.props.admin}
                productCount={this.props.productCount}
                products={this.props.products}
                auctions={this.props.auctions}
                createAuction={this.createAuction}
                bid={this.bid}
                productsOnAuction={this.props.productsOnAuction}
                activeAuction={this.props.activeAuction}
              />
              <ProductListSoonOnAuction
                admin={this.props.admin}
                productCount={this.props.productCount}
                productsOnAuction={this.props.productsOnAuction}
                products={this.props.products}
                auctions={this.props.auctions}
                createAuction={this.createAuction}
                bid={this.bid}
                deleteProduct={this.deleteProduct}
                activeAuction={this.props.activeAuction}
              />
            </div>
          </div>
        )}
        {/* </main> */}
        {/* </div> */}
      </div>
    );
  }
}

export default Home;