import React, { Component } from "react";
import { Link } from "react-router-dom";
import Web3 from "web3";
import AuctionHouse from "../../abis/AuctionHouse.json";

const ipfsClient = require("ipfs-api");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

class AddProduct extends Component {
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
      const artistCount = await auctionHouse.methods.artistCount().call();
      this.setState({ artistCount });
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
      owner: "",
      artists: [],
      artistCount: 0,
      loading: true,
      admin: true,
    };
    this.createProduct = this.createProduct.bind(this);
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

  submitHandler = (event) => {
    event.preventDefault();
    const name = this.productName.value;
    const price = window.web3.utils.toWei(
      this.productPrice.value.toString(),
      "Ether"
    );
    const artist_name = this.productArtist.value;
    const category = this.productCategory.value;
    const description = this.productDescription.value;
    this.createProduct(name, price, artist_name, category, description);
  };

  render() {
    // let { valid, written } = this.state,
    //   divClass = "form-group has-";
    // valid && written && (divClass += "success");
    // !valid && written && (divClass += "danger");
    if (this.state.owner === this.state.account) {
      return (
        <div id="content">
          {this.state.loading ? (
            <div id="loader" className="text-center">
              <p className="text-center">Loading...</p>
            </div>
          ) : (
            <div id="content">
              <h1>Add Product</h1>
              <form onSubmit={this.submitHandler}>
                <fieldset className="form-group">
                  <div className="form-group">
                    <label className="col-sm-2 col-form-label">
                      Product name
                    </label>
                    <div className="col-sm-10">
                      <input
                        id="productName"
                        type="text"
                        ref={(input) => {
                          this.productName = input;
                        }}
                        className="form-control"
                        placeholder="Product Name"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-2 col-form-label">
                      Product price
                    </label>
                    <div className="col-sm-10">
                      <input
                        id="productPrice"
                        name="price"
                        type="number"
                        min="0.01"
                        step=".01"
                        ref={(input) => {
                          this.productPrice = input;
                        }}
                        className="form-control"
                        placeholder="Product Price"
                        required
                        onChange={this.changeHandler}
                      />
                      <small className="form-text text-muted">
                        Price should be in ethers.
                      </small>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label mt-4">Artist</label>
                    <div className="col-sm-10">
                      <select
                        className="form-select"
                        ref={(value) => {
                          this.productArtist = value;
                        }}
                        required
                        placeholder="Select Artist"
                      >
                        {this.state.artists.map((artist, key) => (
                          <option value={artist.id_artist}>
                            {artist.artist_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <small>
                      If artist is not in list, add the artist first
                    </small>
                  </div>
                  <div className="form-group">
                    <label className="form-label mt-4">Category</label>
                    <div className="col-sm-10">
                      <select
                        className="form-select"
                        ref={(option) => {
                          this.productCategory = option;
                        }}
                        required
                        placeholder="Select category"
                      >
                        <option>Select Category...</option>
                        <option>Painting</option>
                        <option>Sculpture</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-2 col-form-label">
                      Description
                    </label>
                    <div className="col-sm-10">
                      <textarea
                        id="productDescription"
                        type="text"
                        rows="3"
                        ref={(input) => {
                          this.productDescription = input;
                        }}
                        className="form-control"
                        placeholder="Product Description"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label mt-4">Image file</label>
                    <input
                      className="form-control"
                      type="file"
                      accept=".jpg, .jpeg, .png, .bmp"
                      onChange={this.captureFile}
                      required
                    />
                  </div>
                  <p></p>
                  <button type="submit" className="btn btn-primary">
                    Add Product
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
      return <div>You have to be logged in as an owner to add a product</div>;
    }
  }
}

export default AddProduct;
