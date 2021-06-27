import React, { Component } from "react";
import "../App.css";
import ProductList from "../Products/ProductList";
import CarouselFile from "../MainPage/CarouselFile";
import ProductListSoonOnAuction from "../Products/ProductListSoonOnAuction";

class Home extends Component {
  render() {
    return (
      <div className="center">
        <CarouselFile />
        <div className="d-flex">
          <ProductList />
          <ProductListSoonOnAuction />
        </div>
      </div>
    );
  }
}

export default Home;
