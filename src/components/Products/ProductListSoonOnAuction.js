import React, { Component } from "react";
import ProductSoon from "./ProductSoon";
import "../App.css";
import Web3 from "web3";
import AuctionHouse from "../../abis/AuctionHouse.json";

class ProductListSoonOnAuction extends Component {
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
      const productCount = await auctionHouse.methods.productCount().call();
      const productsOnAuction = await auctionHouse.methods
        .productsOnAuction()
        .call();
      const activeAuction = await auctionHouse.methods.activeAuction().call();
      const owner = await auctionHouse.methods.owner().call();
      this.setState({ productCount });
      this.setState({ productsOnAuction });
      this.setState({ activeAuction });
      this.setState({ owner });
      for (var i = 1; i <= productCount; i++) {
        const product = await auctionHouse.methods.products(i).call();
        this.setState({
          products: [...this.state.products, product],
        });
      }
      this.setState({ loading: false });
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
      productCount: 0,
      productsOnAuction: 0,
      activeAuction: 0,
      owner: "",
      products: [],
      loading: true,
      admin: true
    };
  }

  render() {
    return (
      <div>
        {this.state.loading ? (
          <div id="loader" className="text-center">
            <p className="text-center">Loading...</p>
          </div>
        ) : (
          <div id="center">
            <p>&nbsp;</p>
            {(this.state.productsOnAuction === this.state.activeAuction) ? (
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
                  {this.state.products.map((product, key) => {
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
