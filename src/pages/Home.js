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
import Carousel from "react-bootstrap/Carousel";
import image1 from "../images/image1.png"

class Home extends Component {
  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex">
            {this.props.loading ? (
              <div id="loader" className="text-center">
                <p className="text-center">Loading...</p>
              </div>
            ) : (
              <div className="carousel">
                {/* <SearchForm
                  productCount={this.props.productCount}
                  products={this.props.products}
                /> */}
                <Carousel>
                  <Carousel.Item>
                    <img
                      src={image1}
                      alt="image1"
                      style={{ maxWidth: "600px" }}
                    />
                    <Carousel.Caption>
                      <h3>First slide label</h3>
                      <p>
                        Nulla vitae elit libero, a pharetra augue mollis
                        interdum.
                      </p>
                    </Carousel.Caption>
                  </Carousel.Item>
                  <Carousel.Item>
                    <img
                      className="d-block w-100"
                      src="holder.js/800x400?text=Second slide&bg=282c34"
                      alt="Second slide"
                    />
                    <Carousel.Caption>
                      <h3>Second slide label</h3>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </p>
                    </Carousel.Caption>
                  </Carousel.Item>
                  <Carousel.Item>
                    <img
                      className="d-block w-100"
                      src="holder.js/800x400?text=Third slide&bg=20232a"
                      alt="Third slide"
                    />

                    <Carousel.Caption>
                      <h3>Third slide label</h3>
                      <p>
                        Praesent commodo cursus magna, vel scelerisque nisl
                        consectetur.
                      </p>
                    </Carousel.Caption>
                  </Carousel.Item>
                </Carousel>
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