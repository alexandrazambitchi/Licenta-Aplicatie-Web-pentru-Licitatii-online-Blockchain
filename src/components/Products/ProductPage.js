import React, { Component } from "react";
import ProductInfo from "../ProductPage/ProductInfo";
import Auction from "../Products/Auction";
import Error from "../pages/Error";
import Web3 from "web3";
import AuctionHouse from "../../abis/AuctionHouse.json";

class ProductPage extends Component {
  async componenWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    this.state.timer1 = setTimeout(
      () => this.setState({ disable: true }),
      this.state.endTime * 1000 - Date.now()
    );
  }

  async componentWillUnmount() {
    clearTimeout(this.state.timer1);
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
      const auctionCount = await auctionHouse.methods.auctionCount().call();
      const owner = await auctionHouse.methods.owner().call();
      this.setState({ artistCount });
      this.setState({ productCount });
      this.setState({ auctionCount });
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
      window.alert("Auction House contract not deployed to detected network.");
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      productCount: 0,
      auctionCount: 0,
      artistCount: 0,
      owner: "",
      winner: "",
      productSelected: null,
      artistFound: null,
      artists: [],
      products: [],
      auctions: [],
      params: 0,
      loading: true,
      admin: true,
      auctionTimer: 0,
      targetHit: false,
      endTime: -1,
      disable: false,
      endDate: 0,
      auctionFound: null,
      moneySent: false,
      sell: false,
      targetValue: 0,
      highestBidValue: 0,
      timer1: null,
    };
    this.deleteProduct = this.deleteProduct.bind(this);
    this.createAuction = this.createAuction.bind(this);
    this.editAuction = this.editAuction.bind(this);
    this.bid = this.bid.bind(this);
    this.sellingUnderTarget = this.sellingUnderTarget.bind(this);
    this.auctionEnd = this.auctionEnd.bind(this);
  }

  deleteProduct(id_product) {
    this.setState({ loading: true });
    this.state.auctionHouse.methods
      .deleteProduct(id_product)
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        window.location.reload();
        this.setState({ loading: false });
      });
  }

  createAuction(id) {
    this.setState({ loading: true });
    this.state.auctionHouse.methods
      .createAuction(id)
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        window.location.reload();
        this.setState({ loading: false });
      });
  }

  editAuction(id, target) {
    this.setState({ loading: true });
    this.state.auctionHouse.methods
      .editAuction(id, target)
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        window.location.reload();
        this.setState({ loading: false });
      });
  }

  bid(id_auction, value, id_prod) {
    this.setState({ loading: true });
    this.state.auctionHouse.methods
      .bid(id_auction, value, id_prod)
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        window.location.reload();
        this.setState({ loading: false });
      });
  }

  sendValue(valueBid, id) {
    this.setState({ loading: true });
    this.state.auctionHouse.methods
      .sendValue(id)
      .send({ from: this.state.account, value: valueBid })
      .once("receipt", (receipt) => {
        window.location.reload();
        this.setState({ loading: false });
      });
  }

  sellingUnderTarget(id) {
    this.setState({ loading: true });
    this.state.auctionHouse.methods
      .sellingUnderTarget(id)
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        window.location.reload();
        this.setState({ loading: false });
      });
  }

  auctionEnd(id, valueBid, winnerAccount) {
    this.setState({ loading: true });
    this.state.auctionHouse.methods
      .auctionEnd(id)
      .send({ from: this.state.account })
      .once("receipt", (receipt) => {
        window.location.reload();
        this.setState({ loading: false });
      });
  }

  getParams() {
    this.setState({ params: this.props.match.params.id_product });
  }

  getProduct() {
    this.state.products.map((product, key) => {
      if (product.id_product === this.state.params) {
        this.setState({ productSelected: product });
      }
    });
  }

  getArtist(id_artist) {
    this.state.artists.map((artist, key) => {
      if (artist.id_artist === this.state.productSelected.id_artist) {
        this.setState({ artistFound: artist });
      }
    });
  }

  getAuction() {
    this.state.auctions.map((auction, key) => {
      if (auction.id_product === this.state.params) {
        this.setState({ auctionFound: auction });
      }
    });
  }

  isTargetHit() {
    if (
      window.web3.utils.fromWei(this.state.auctionFound.highestBid, "Ether") >=
      window.web3.utils.fromWei(this.state.auctionFound.target_price, "Ether")
    ) {
      this.setState({ targetHit: true });
      this.setState({ disable: true });
    }
  }

  isSoldUnder() {
    if (this.state.auctionFound.sellUnderTarget === true) {
      this.setState({ sell: true });
    }
  }

  getTargetValue() {
    this.setState({
      targetValue: window.web3.utils.fromWei(
        this.state.auctionFound.target_price,
        "Ether"
      ),
    });
  }

  getHighestBid() {
    if (this.state.auctionFound.offerCount === "0") {
      this.setState({
        highestBidValue: window.web3.utils.fromWei(
          this.state.productSelected.price,
          "Ether"
        ),
      });
    } else {
      this.setState({
        highestBidValue: window.web3.utils.fromWei(
          this.state.auctionFound.highestBid,
          "Ether"
        ),
      });
    }
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
            {Number(this.state.params) > Number(this.state.productCount) ? (
              <Error />
            ) : (
              <div>
                {this.state.params === 0 ? this.getParams() : null}
                {!this.state.productSelected ? (
                  this.getProduct()
                ) : (
                  <div>
                    {this.state.productSelected.active ? (
                      <div className="d-flex">
                        <div className="p-2 flex-grow-1 bd-highlight">
                          <h2 className="section-title">
                            {this.state.productSelected.name}
                          </h2>
                          {!this.state.artistFound ? (
                            this.getArtist(this.state.productSelected.id_artist)
                          ) : (
                            <ProductInfo
                              {...this.state.productSelected}
                              artist={this.state.artistFound.artist_name}
                            />
                          )}
                          <div className="p-2 text-left">
                            {this.state.admin ? (
                              <div>
                                {!this.state.productSelected.auction_started ? (
                                  <button
                                    className="btn btn-primary"
                                    name={this.state.productSelected.id_product}
                                    onClick={(event) => {
                                      this.createAuction(
                                        this.state.productSelected.id_product
                                      );
                                    }}
                                  >
                                    Start Auction
                                  </button>
                                ) : (
                                  <div>
                                    {!this.state.auctionFound ? (
                                      this.getAuction()
                                    ) : (
                                      <div>
                                        {this.state.auctionFound.offerCount ===
                                        "0" ? (
                                          <form
                                            onSubmit={(event) => {
                                              event.preventDefault();
                                              const value =
                                                window.web3.utils.toWei(
                                                  this.newTarget.value.toString(),
                                                  "Ether"
                                                );
                                              this.editAuction(
                                                this.state.auctionFound
                                                  .id_auction,
                                                value
                                              );
                                            }}
                                          >
                                            {this.state.targetValue === 0 ? (
                                              this.getTargetValue()
                                            ) : (
                                              <div className="form-group">
                                                <label className="form-label mt-4">
                                                  New target price
                                                </label>
                                                <input
                                                  id="newTarget"
                                                  type="number"
                                                  min={this.state.targetValue}
                                                  step=".01"
                                                  ref={(input) => {
                                                    this.newTarget = input;
                                                  }}
                                                  className="form-control"
                                                  placeholder="New target price"
                                                />
                                                <small className="form-text text-muted">
                                                  Price should be in ethers.
                                                </small>
                                              </div>
                                            )}
                                            <button
                                              type="submit"
                                              className="btn btn-primary"
                                            >
                                              Change target price
                                            </button>
                                          </form>
                                        ) : null}
                                        {!this.state.auctionFound.moneySent ? (
                                          <div>
                                            <button
                                              className="btn btn-primary"
                                              name={
                                                this.state.productSelected
                                                  .id_product
                                              }
                                              onClick={(event) => {
                                                this.deleteProduct(
                                                  this.state.productSelected
                                                    .id_product
                                                );
                                              }}
                                            >
                                              Delete product
                                            </button>
                                          </div>
                                        ) : null}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div className="p-2 flex-grow-1 bd-highlight">
                          {!this.state.productSelected.auction_started ? (
                            <p>Auction has not started yet! Coming soon!</p>
                          ) : (
                            <div className="p-2">
                              {!this.state.auctionFound ? (
                                this.getAuction()
                              ) : (
                                <div>
                                  {this.state.auctionTimer === 0
                                    ? this.setState({
                                        auctionTimer: this.state.auctionFound,
                                      })
                                    : null}
                                  {this.state.endDate === 0
                                    ? this.setState({ endDate: new Date() })
                                    : null}
                                  {this.state.endTime === -1
                                    ? this.setState({
                                        endTime:
                                          this.state.auctionFound
                                            .auctionEndTime,
                                      })
                                    : null}
                                  <h2>Auction started</h2>
                                  <p>You can place your offer</p>
                                  <p>
                                    Starting price:{" "}
                                    {window.web3.utils.fromWei(
                                      this.state.productSelected.price,
                                      "Ether"
                                    )}{" "}
                                    Eth
                                  </p>
                                  {!this.state.auctionFound.ended ? (
                                    <section>
                                      {!this.state.admin ? (
                                        <div>
                                          <form
                                            onSubmit={(event) => {
                                              event.preventDefault();
                                              const value =
                                                window.web3.utils.toWei(
                                                  this.bidValue.value.toString(),
                                                  "Ether"
                                                );
                                              this.bid(
                                                this.state.auctionFound
                                                  .id_auction,
                                                value,
                                                this.state.productSelected
                                                  .id_product
                                              );
                                            }}
                                          >
                                            {this.state.highestBidValue ===
                                            0 ? (
                                              this.getHighestBid()
                                            ) : (
                                              <div className="form-group">
                                                {this.state.disable ? (
                                                  <h2>
                                                    You can no longer place
                                                    bids. Auction ends soon.
                                                  </h2>
                                                ) : null}
                                                {this.state.targetHit ? (
                                                  <h3>Target price was hit!</h3>
                                                ) : null}
                                                {this.state.disable &&
                                                !this.state.targetHit ? (
                                                  <h3>
                                                    Time to place bets ended
                                                  </h3>
                                                ) : null}
                                                <label className="form-label mt-4">
                                                  Bid Value
                                                </label>
                                                <input
                                                  id="bidValue"
                                                  type="number"
                                                  min={
                                                    this.state.highestBidValue
                                                  }
                                                  step=".01"
                                                  ref={(input) => {
                                                    this.bidValue = input;
                                                  }}
                                                  className="form-control"
                                                  placeholder="Bid Value"
                                                  required
                                                  disabled={this.state.disable}
                                                />
                                                <small className="form-text text-muted">
                                                  Price should be in ethers.
                                                </small>
                                              </div>
                                            )}
                                            <button
                                              type="submit"
                                              className="btn btn-primary"
                                              disabled={this.state.disable}
                                            >
                                              Place bid
                                            </button>
                                            <p></p>
                                            {!this.state.targetHit
                                              ? this.isTargetHit()
                                              : null}
                                          </form>
                                          {!this.state.auctionFound.moneySent &&
                                          this.state.targetHit ? (
                                            <button
                                              className="btn btn-primary"
                                              onClick={(event) => {
                                                this.sendValue(
                                                  this.state.auctionFound
                                                    .highestBid,
                                                  this.state.auctionFound
                                                    .id_auction
                                                );
                                                this.setState({
                                                  moneySent: true,
                                                });
                                              }}
                                            >
                                              Send money!
                                            </button>
                                          ) : null}
                                          {!this.state.sell
                                            ? this.isSoldUnder()
                                            : null}
                                          {!this.state.auctionFound.moneySent &&
                                          this.state.sell ? (
                                            <button
                                              className="btn btn-primary"
                                              onClick={(event) => {
                                                this.sendValue(
                                                  this.state.auctionFound
                                                    .highestBid,
                                                  this.state.auctionFound
                                                    .id_auction
                                                );
                                                this.setState({
                                                  moneySent: true,
                                                });
                                              }}
                                            >
                                              Send money!
                                            </button>
                                          ) : null}
                                        </div>
                                      ) : (
                                        <div>
                                          {!this.state.productSelected
                                            .purchased ? (
                                            <section>
                                              <button
                                                className="btn btn-primary"
                                                name={
                                                  this.state.productSelected
                                                    .id_product
                                                }
                                                onClick={(event) => {
                                                  this.auctionEnd(
                                                    this.state.auctionFound
                                                      .id_auction,
                                                    this.state.auctionFound
                                                      .highestBid,
                                                    this.state.auctionFound
                                                      .highestBidder
                                                  );
                                                }}
                                              >
                                                End Auction
                                              </button>
                                            </section>
                                          ) : null}
                                          {!this.state.targetHit
                                            ? this.isTargetHit()
                                            : null}
                                          {!this.state.sell
                                            ? this.isSoldUnder()
                                            : null}
                                          {!this.state.targetHit &&
                                          this.state.disable &&
                                          !this.state.sell ? (
                                            <button
                                              className="btn btn-primary"
                                              name={
                                                this.state.productSelected
                                                  .id_product
                                              }
                                              onClick={(event) => {
                                                this.sellingUnderTarget(
                                                  this.state.auctionFound
                                                    .id_auction
                                                );
                                              }}
                                            >
                                              Sell to highest bidder
                                            </button>
                                          ) : null}
                                        </div>
                                      )}
                                    </section>
                                  ) : (
                                    <div>
                                      <h1>Auction ended</h1>
                                      {console.log(
                                        this.state.auctionFound.highestBid === 0
                                      )}
                                      {this.state.auctionFound.highestBid ===
                                      0 ? (
                                        <p>No one bid at this auction</p>
                                      ) : (
                                        <section>
                                          {!this.state.targetHit
                                            ? this.isTargetHit()
                                            : null}
                                          {!this.state.sell
                                            ? this.isSoldUnder()
                                            : null}
                                          {!this.state.targetHit &&
                                          !this.state.sell ? (
                                            <h3>
                                              No one bid above the target price
                                            </h3>
                                          ) : (
                                            <section>
                                              <h3>Product sold</h3>
                                              <p>
                                                Sold for:{" "}
                                                {window.web3.utils.fromWei(
                                                  this.state.auctionFound
                                                    .highestBid,
                                                  "Ether"
                                                )}{" "}
                                                Eth to highest bidder
                                              </p>
                                            </section>
                                          )}
                                        </section>
                                      )}
                                    </div>
                                  )}
                                  <section>
                                    <h2 className="section-title">Details:</h2>
                                    <Auction
                                      {...this.state.auctionFound}
                                      admin={this.state.admin}
                                    />
                                  </section>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <Error />
                    )}
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

export default ProductPage;
