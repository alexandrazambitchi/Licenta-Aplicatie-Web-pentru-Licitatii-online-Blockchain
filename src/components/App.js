import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
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
import AddArtist from "./pages/AddArtist";
import ArtistList from "./pages/ArtistList"
import ArtistPage from "./pages/ArtistPage"
import Products from "./Products/Products"

class App extends Component {
  async componenWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async componentDidMount() {
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
      const owner = await auctionHouse.methods.owner().call();
      this.setState({ owner });
      if (this.state.account === this.state.owner) {
        this.setState({ admin: true });
      } else {
        this.setState({ admin: false });
      }
    } else {
      window.alert("Auction House contract not deployed to detected network.");
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      owner: "",
      admin: true,
    };
  }

  render() {
    return (
      <Router>
        <Navbar account={this.state.account} admin={this.state.admin} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/soonauction" component={ProductListSoonOnAuction} />
          <Route exact path="/about">
            <Info />
          </Route>
          <Route exact path="/addproduct" component={AddProduct} />
          <Route exact path="/addartist" component={AddArtist} />
          <Route exact path="/activeauction" component={ProductList} />
          <Route exact path="/product/:id_product" component={ProductPage}/>
          <Route exact path="/artist/:id_artist" component={ArtistPage} />
          <Route exact path="/artists" component={ArtistList} />
          <Route exact path="/products" component={Products} />
          <Route exact path="/sold" component={Sold} />
          <Route path="*">
            <Error />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
