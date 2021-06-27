import React, { Component } from "react";
import "../App.css";
import Product from "../Products/ProductEnded";
import Error from "../pages/Error";
import Web3 from "web3";
import AuctionHouse from "../../abis/AuctionHouse.json";

class ArtistPage extends Component {
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
      const artistCount = await auctionHouse.methods.artistCount().call();
      const productCount = await auctionHouse.methods.productCount().call();
      const owner = await auctionHouse.methods.owner().call();
      this.setState({ artistCount });
      this.setState({ productCount });
      this.setState({ owner });
      for (var i = 1; i <= artistCount; i++) {
        const artist = await auctionHouse.methods.artists(i).call();
        this.setState({
          artists: [...this.state.artists, artist],
        });
      }
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
      artistCount: 0,
      owner: "",
      artistFound: null,
      artists: [],
      products: [],
      loading: true,
      admin: true,
      params: 0,
      checked: false,
    };
    this.donate = this.donate.bind(this);
  }

  donate(valueDonation, artist_id) {
    this.setState({ loading: true });
    this.state.auctionHouse.methods
      .donation(valueDonation, artist_id)
      .send({ from: this.state.account, value: valueDonation })
      .once("receipt", (receipt) => {
        this.setState({ loading: false });
      });
  }

  getArtist() {
    this.state.artists.map((artist, key) => {
      if (artist.id_artist === this.state.params) {
        this.setState({ artistFound: artist });
      }
    });
  }

  getParams() {
    this.setState({ params: this.props.match.params.id_artist });
  }

  render() {
    return (
      <div id="content">
        {this.state.loading ? (
          <div id="loader" className="text-center">
            <p className="text-center">Loading...</p>
          </div>
        ) : (
          <div id="content">
            {this.state.params === 0 ? this.getParams() : null}
            {this.state.params > this.state.artistCount ? (
              <Error />
            ) : (
              <div>
                {this.state.params === 0 ? this.getParams() : null}
                {!this.state.artistFound ? (
                  this.getArtist()
                ) : (
                  <div className="center">
                    <h2 className="section-title text-center">
                      {this.state.artistFound.artist_name}
                    </h2>
                    <h3 className="section-title text-center">
                      {this.state.artistFound.details}
                    </h3>
                    <div>
                      {!this.state.admin ? (
                        <form
                          onSubmit={(event) => {
                            event.preventDefault();
                            const value = window.web3.utils.toWei(
                              this.donation.value.toString(),
                              "Ether"
                            );
                            this.donate(
                              value,
                              this.state.artistFound.id_artist
                            );
                          }}
                        >
                          <div className="form-group">
                            <p>
                              You can help the new artists to develop their art
                              by donating any sum of money.
                            </p>
                            <label className="form-label mt-4">Donation</label>
                            <input
                              id="donation"
                              type="number"
                              min="0.01"
                              step=".01"
                              ref={(input) => {
                                this.donation = input;
                              }}
                              className="form-control"
                              placeholder="Donation value"
                            />
                            <small className="form-text text-muted">
                              Value should be in ethers.
                            </small>
                          </div>
                          <button type="submit" className="btn btn-primary">
                            Donate!
                          </button>
                          <p></p>
                        </form>
                      ) : (
                        <div>
                          <p>
                            Value collected:{" "}
                            {window.web3.utils.fromWei(
                              this.state.artistFound.amount_collected,
                              "Ether"
                            )}{" "}
                            Eth
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="grid-container">
                      {this.state.products.map((product, key) => {
                        if (
                          product.id_artist ===
                            this.state.artistFound.id_artist &&
                          product.active
                        ) {
                          {
                            !this.state.checked
                              ? this.setState({ checked: true })
                              : null;
                          }
                          return (
                            <Product
                              key={key}
                              {...product}
                              {...this.state.artistFound.artist_name}
                            />
                          );
                        }
                      })}
                      {!this.state.checked ? (
                        <p>No products available</p>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default ArtistPage;
