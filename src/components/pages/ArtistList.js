import React, { Component } from "react";
import Artist from "./Artist";
import "../App.css";
import Web3 from "web3";
import AuctionHouse from "../../abis/AuctionHouse.json";

class ArtistList extends Component {
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
      const owner = await auctionHouse.methods.owner().call();
      this.setState({ artistCount });
      this.setState({ owner });
      for (var i = 1; i <= artistCount; i++) {
        const artist = await auctionHouse.methods.artists(i).call();
        this.setState({
          artists: [...this.state.artists, artist],
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
      artistCount: 0,
      owner: "",
      artists: [],
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
            {this.state.artistCount === "0" ? (
              <div className="text-center">
                <h2 className="section-title text-center">Artists</h2>
                <h3 className="section-title text-center">No results</h3>
              </div>
            ) : (
              <div className="product-center">
                <h2 className="section-title text-center">Artists</h2>
                <div className="grid-container">
                  {this.state.artists.map((artist, key) => {
                    return <Artist key={key} {...artist} />;
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

export default ArtistList;
