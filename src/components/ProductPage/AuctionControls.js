import React, { Component } from "react";
import { useParams, Link } from "react-router-dom";
import Auction from "../Products/Auction";

const AuctionControls = (props) => {
  const params = useParams();
  console.log("Controls", params);
  return (
    <section>
      {/* <p>{params.id_product}</p> */}
      {props.products.map((product, key) => {
          <div>
            {product.id_product === params.id_product ? (
              <div>
                <p>Working</p>
                {props.auctions.map((auction, key) => {
                  // return (
                  <div>
                    {auction.id_product === params.id_product ? (
                      <section>
                        <p>You can place your offer</p>
                        <p>
                          Starting price:{" "}
                          {window.web3.utils.fromWei(product.price, "Ether")}{" "}
                          Eth
                        </p>
                        {!product.auction_ended ? (
                          <section>
                            {!props.admin ? (
                              <form
                                onSubmit={(event) => {
                                  event.preventDefault();
                                  const value = window.web3.utils.toWei(
                                    this.bidValue.value.toString(),
                                    "Ether"
                                  );
                                  props.bid(
                                    auction.id_auction,
                                    value,
                                    product.id_product
                                  );
                                }}
                              >
                                <div className="form-group">
                                  <label
                                    // for="bidvalue"
                                    className="form-label mt-4"
                                  >
                                    Bid Value
                                  </label>
                                  <input
                                    id="bidValue"
                                    type="text"
                                    ref={(input) => {
                                      this.bidValue = input;
                                    }}
                                    className="form-control"
                                    placeholder="Bid Value"
                                    required
                                  />
                                  <small className="form-text text-muted">
                                    Price should be in ethers.
                                  </small>
                                </div>
                                <button
                                  type="submit"
                                  className="btn btn-primary"
                                >
                                  Place bid
                                </button>
                              </form>
                            ) : <p>No admin</p>}
                          </section>
                        ) : (
                          <p>Auction ended</p>
                        )}
                        <section>
                          <h2 className="section-title">Details:</h2>
                          <Auction key={key} {...auction} />
                        </section>
                      </section>
                    ) : (<p>No auction</p>)}
                  </div>;
                  // );
                })}
              </div>
            ) : (<p>Empty list</p>)}
          </div>;
      })}
    </section>
  );
}

export default AuctionControls