import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Web3 from "web3";
import "../components/App.css";
import AuctionHouse from "../abis/AuctionHouse.json";
import Navbar from "../components/Navbar";
import Main from "../components/Main";
import AddProduct from "../components/AddProduct";
import { Link } from "react-router-dom";
import SearchForm from "../components/SearchForm"

class Home extends Component {
  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex">
            {this.props.loading ? (
              <div id="loader" className="text-center">
                {/* <p className="text-center">Loading...</p> */}
              </div>
            ) : (
              <div>
                {/* <SearchForm
                  productCount={this.props.productCount}
                  products={this.props.products}
                /> */}

                <Main
                  admin={this.props.admin}
                  productCount={this.props.productCount}
                  products={this.props.products}
                  auctions={this.props.auctions}
                  createAuction={this.createAuction}
                  bid={this.bid}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }
}

export default Home;