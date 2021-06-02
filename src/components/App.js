import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import history from "./History";
import Web3 from "web3";
import "./App.css";
import AuctionHouse from "../abis/AuctionHouse.json";
import Navbar from "./MainPage/Navbar";
import Home from "./pages/Home";
import Info from "./pages/Info";
import Error from "./pages/Error";
import ProductPage from "./Products/ProductPage";
import AddProduct from "./Products/AddProduct";
import ProductList from "./Products/ProductList";
import ProductListSoonOnAuction from "./Products/ProductListSoonOnAuction";
import Sold from "./Products/EndedAuction"

const ipfsClient = require("ipfs-api");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

class App extends Component {
  async componenWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    // location.reload(false);
  }

  async componentDidMount() {
    // window.location.reload(false);
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
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

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();
    const networkData = AuctionHouse.networks[networkId];
    if (networkData) {
      const auctionHouse = new web3.eth.Contract(
        AuctionHouse.abi,
        networkData.address
      );
      this.setState({ auctionHouse });
      const productCount = await auctionHouse.methods.productCount().call();
      const auctionCount = await auctionHouse.methods.auctionCount().call();
      const productsOnAuction = await auctionHouse.methods.productsOnAuction().call();
      const activeAuction = await auctionHouse.methods.activeAuction().call();
      const owner = await auctionHouse.methods.owner().call();
      this.setState({ productCount });
      this.setState({ auctionCount });
      this.setState({ productsOnAuction });
      this.setState({ activeAuction });
      this.setState({ owner });
      
      for (var i = 1; i <= productCount; i++) {
        const product = await auctionHouse.methods.products(i).call();
        this.setState({
          products: [...this.state.products, product],
        });
      }
      for (var i = 1; i <= auctionCount; i++) {
        const auction = await auctionHouse.methods.auctionList(i).call();
        this.setState({
          auctions: [...this.state.auctions, auction],
        });
      }
      this.setState({ loading: false });
      if (this.state.account === this.state.owner) {
        this.setState({ admin: true });
      } else {
        this.setState({ admin: false });
      }
    } else {
      window.alert("Marketplace contract not deployed to detected network.");
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      productCount: 0,
      auctionCount: 0,
      productsOnAuction: 0,
      activeAuction: 0,
      owner: "",
      winner: "",
      products: [],
      auctions: [],
      loading: true,
      admin: true,
    };
    this.createProduct = this.createProduct.bind(this);
    this.createAuction = this.createAuction.bind(this);
    this.bid = this.bid.bind(this);
    this.auctionEnd = this.auctionEnd.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
  }

  captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("buffer", this.state.buffer);
    };
  };

  createProduct(name, price, artist, category, description) {
    console.log("Submiting file...");

    ipfs.add(this.state.buffer, (error, result) => {
      console.log("Ipfs result", result);
      if (error) {
        console.error(error);
        return;
      }
      this.setState({ loading: true });
      this.state.auctionHouse.methods
        .createProduct(
          name,
          price,
          artist,
          category,
          description,
          result[0].hash
        )
        .send({ from: this.state.account })
        .once("receipt", (receipt) => {
          this.setState({ loading: false });
        });
    });
  }

  createAuction(id) {
    this.setState({ loading: true });
    this.state.auctionHouse.methods
      .createAuction(id)
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        this.setState({ loading: false });
      });
  }

  bid(id_auction, value, id_prod) {
    this.setState({ loading: true });
    this.state.auctionHouse.methods
      .bid(id_auction, value, id_prod)
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        this.setState({ loading: false });
      });
  }

  auctionEnd(id, valueBid, winnerAccount) {
    this.setState({ loading: true });
    const web3 = window.web3;
    // web3.eth.sendTransaction({
    //   from: winnerAccount,
    //   to: this.state.account,
    //   value: valueBid
    // }, function(error, result){
    //   if(!error){
    //     console.log(result)
    //   } else{
    //     console.log(error);
    //   }
    // })
    this.setState({winner: winnerAccount})
    this.state.auctionHouse.methods
      .auctionEnd(id)
      .send({ from: this.state.account, value: valueBid })
      .once("receipt", (receipt) => {
        this.setState({ loading: false });
      });
  }

  deleteProduct(id_product) {
    this.setState({ loading: true });
    this.state.auctionHouse.methods
      .deleteProduct(id_product)
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        this.setState({ loading: false });
      });
  }

  render() {
    return (
      <Router history={history}>
        <Navbar account={this.state.account} admin={this.state.admin} />
        <Switch>
          <Route exact path="/">
            <Home
              admin={this.state.admin}
              owner={this.state.owner}
              account={this.state.account}
              products={this.state.products}
              auctions={this.state.auctions}
              productCount={this.state.productCount}
              productsOnAuction={this.state.productsOnAuction}
              activeAuction={this.state.activeAuction}
              createProduct={this.createProduct}
              createAuction={this.createAuction}
              bid={this.bid}
              captureFile={this.captureFile}
              uploadImage={this.uploadImage}
              deleteProduct={this.deleteProduct}
              loading={this.state.loading}
            />
          </Route>
          <Route exact path="/soonauction">
            <ProductListSoonOnAuction
              admin={this.state.admin}
              productCount={this.state.productCount}
              productsOnAuction={this.state.productsOnAuction}
              activeAuction={this.state.activeAuction}
              products={this.state.products}
              auctions={this.state.auctions}
              createAuction={this.createAuction}
              bid={this.bid}
              deleteProduct={this.deleteProduct}
              loading={this.state.loading}
            />
          </Route>
          <Route exact path="/about">
            <Info />
          </Route>
          <Route exact path="/addproduct">
            <AddProduct
              admin={this.state.admin}
              owner={this.state.owner}
              account={this.state.account}
              products={this.state.products}
              auctions={this.state.auctions}
              createProduct={this.createProduct}
              loading={this.state.loading}
              captureFile={this.captureFile}
              uploadImage={this.uploadImage}
              deleteProduct={this.deleteProduct}
            />
          </Route>
          <Route exact path="/activeauction">
            <ProductList
              admin={this.state.admin}
              productCount={this.state.productCount}
              productsOnAuction={this.state.productsOnAuction}
              products={this.state.products}
              auctions={this.state.auctions}
              activeAuction={this.state.activeAuction}
              createAuction={this.createAuction}
              bid={this.bid}
              deleteProduct={this.deleteProduct}
              loading={this.state.loading}
            />
          </Route>
          <Route exact path="/product/:id_product">
            <ProductPage
              products={this.state.products}
              admin={this.state.admin}
              auctionCount={this.state.auctionCount}
              createAuction={this.createAuction}
              bid={this.bid}
              auctions={this.state.auctions}
              activeAuction={this.state.activeAuction}
              account={this.state.account}
              auctionEnd={this.auctionEnd}
              deleteProduct={this.deleteProduct}
              loading={this.state.loading}
            />
          </Route>
          <Route exact path="/sold">
            <Sold
              products={this.state.products}
              admin={this.state.admin}
              auctionCount={this.state.auctionCount}
              productCount={this.state.productCount}
              activeAuction={this.state.activeAuction}
              productsOnAuction={this.state.productsOnAuction}
              createAuction={this.createAuction}
              bid={this.bid}
              auctions={this.state.auctions}
              account={this.state.account}
              auctionEnd={this.auctionEnd}
              deleteProduct={this.deleteProduct}
              loading={this.state.loading}
            />
          </Route>
          <Route path="*">
            <Error />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
