import React, { Component } from "react";
import { Link } from "react-router-dom";
import Web3 from "web3";
import AuctionHouse from "../../abis/AuctionHouse.json";

class AddArtist extends Component {
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
      owner: "",
      loading: true,
      admin: true,
    };
    this.createArtist = this.createArtist.bind(this);
  }

  createArtist(name, details) {
    this.setState({ loading: true });
    this.state.auctionHouse.methods
      .createArtist(name, details)
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        this.setState({ loading: false });
      });
  }

  submitHandler = (event) => {
    event.preventDefault();
    const name = this.artistName.value;
    const description = this.artistDescription.value;
    this.createArtist(name, description);
  };

  render() {
    if (this.state.owner === this.state.account) {
      return (
        <div id="content">
          {this.state.loading ? (
            <div id="loader" className="text-center">
              <p className="text-center">Loading...</p>
            </div>
          ) : (
            <div id="content">
              <h1>Add Artist</h1>
              <form onSubmit={this.submitHandler}>
                <fieldset className="form-group">
                  <div className="form-group">
                    <label className="col-sm-2 col-form-label">
                      Artist name
                    </label>
                    <div className="col-sm-10">
                      <input
                        id="artistName"
                        type="text"
                        ref={(input) => {
                          this.artistName = input;
                        }}
                        className="form-control"
                        placeholder="Artist Name"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="col-sm-2 col-form-label">
                      Artist Details
                    </label>
                    <div className="col-sm-10">
                      <textarea
                        id="artistDescription"
                        type="text"
                        rows="3"
                        ref={(input) => {
                          this.artistDescription = input;
                        }}
                        className="form-control"
                        placeholder="Artist Description"
                        required
                      />
                    </div>
                  </div>
                  <p></p>
                  <button type="submit" className="btn btn-primary">
                    Add Artist
                  </button>
                  <Link to="/" className="btn btn-primary">
                    Back Home
                  </Link>
                </fieldset>
              </form>
            </div>
          )}
        </div>
      );
    } else {
      return <div>You have to be logged in as an owner to add an artist</div>;
    }
  }
}

export default AddArtist;
