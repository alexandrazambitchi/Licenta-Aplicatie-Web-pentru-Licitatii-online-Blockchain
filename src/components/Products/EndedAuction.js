import React, { Component } from "react";
import ProductSold from "./ProductEnded";
import "../App.css";
import Web3 from "web3";
import AuctionHouse from "../../abis/AuctionHouse.json";

class Sold extends Component {
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
      const soldCount = await auctionHouse.methods.soldCount().call();
      for (var i = 1; i <= productCount; i++) {
        const product = await auctionHouse.methods.products(i).call();
        this.setState({
          products: [...this.state.products, product],
        });
      }
      this.setState({ productCount });
      this.setState({ productsOnAuction });
      this.setState({ soldCount });
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
      soldCount: 0,
      owner: "",
      products: [],
      loading: true,
      admin: true,
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
          <div>
            <p>&nbsp;</p>
            {console.log(
              "prod count",
              this.state.productCount,
              "prod on auction",
              this.state.productsOnAuction
            )}
            {console.log("sold", this.state.soldCount)}
            {this.state.soldCount === "0" ? (
              <div className="text-center">
                <h2 className="section-title text-center">Sold products</h2>
                <h3 className="section-title text-center">No results</h3>
              </div>
            ) : (
              <div className="product-center">
                <h2 className="section-title text-center">Products</h2>
                <h3 className="section-title text-center">Sold</h3>
                <div className="grid-container">
                  {this.state.products.map((product, key) => {
                    if (product.auction_ended) {
                      return <ProductSold key={key} {...product} />;
                    }
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

export default Sold;
