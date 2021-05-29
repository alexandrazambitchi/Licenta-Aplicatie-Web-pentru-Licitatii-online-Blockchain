import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import history from "./History";
import Web3 from "web3";
import "./App.css";

function AllProducts() {
  const[products, setProducts] = useState([]);

  useEffect(()=>{
    function loadWeb3() {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
        } else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider);
        } else {
          window.alert(
            "Non-Ethereum browser detected. You should consider trying MetaMask!"
          );
        }
      }

    
    function loadBlockchainData() {
      const web3 = window.web3;
      const networkId = await web3.eth.net.getId();
      const networkData = AuctionHouse.networks[networkId];
      if (networkData) {
        const auctionHouse = new web3.eth.Contract(
          AuctionHouse.abi,
          networkData.address
        );
        const productCount = await auctionHouse.methods.productCount().call();
        for (var i = 1; i <= productCount; i++) {
        const product = await auctionHouse.methods.products(i).call();
        setProducts(products => [...products, product]);
      }
      }
    }
  }, [])

  return(products)
  
}

// export default AllProducts;