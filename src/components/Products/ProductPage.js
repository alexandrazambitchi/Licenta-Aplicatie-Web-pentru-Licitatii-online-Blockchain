import React, { Component } from "react";
import { useParams, Link } from "react-router-dom";
import Auction from "./Auction";

// function checkIfEnded(endTime, props, id_auction) {
//   var eta = endTime - Date.now();
//   console.log(eta);
//   // if(eta<0 && ended==false){
//   //   ended=true
//   //   return true
//   // }
//   // else{
//   //   return false
//   // }
//   setTimeout(props.auctionEnd(id_auction), eta);
// }

const ProductPage = (props) => {
  const params = useParams();
  console.log(params);
  return (
    <div id="content">
        {props.products.map((product, key) => {
          return (
            <div>
              {product.id_product === params.id_product ? (
                <section className="section product-section">
                  <h2 className="section-title">{product.name}</h2>
                  <div className="product">
                    <img
                      src={`https://ipfs.infura.io/ipfs/${product.image_hash}`}
                      alt={product.name}
                      style={{ maxWidth: "420px" }}
                    />
                    <div className="product-info">
                      <h4>
                        <span className="badge bg-secondary bg-large">
                          Name:
                        </span>
                        {product.name}
                      </h4>
                      <p>
                        <span className="data">Artist Name:</span>
                        {product.artist_name}
                      </p>
                      <p>
                        <span className="data">Category:</span>
                        {product.category}
                      </p>
                      <p>
                        <span className="data">Description:</span>
                        {product.description}
                      </p>
                      <Link to="/" className="btn btn-primary">
                        Back Home
                      </Link>
                    </div>
                    <div>
                      {props.admin ? (
                        <section>
                          <p></p>
                          <p>
                            {!product.auction_started ? (
                              <button
                                className="btn btn-primary"
                                name={product.id_product}
                                onClick={(event) => {
                                  props.createAuction(product.id_product);
                                }}
                              >
                                Start Auction
                              </button>
                            ) : (
                              <div>Auction started</div>
                            )}
                          </p>
                          <button
                            className="btn btn-primary"
                            name={product.id_product}
                            onClick={(event) => {
                              props.deleteProduct(product.id_product);
                            }}
                          >
                            Delete product
                          </button>
                          <button
                            className="btn btn-primary"
                            name={product.id_product}
                            onClick={(event) => {
                              props.auctionEnd(product.id_auction);
                            }}
                          >
                            End Auction
                          </button>
                        </section>
                      ) : null}
                      <p>
                        {!product.auction_started ? (
                          <p>Auction not started</p>
                        ) : (
                          <div>
                            <section className="section">
                              {props.auctions.map((auction, key) => {
                                return (
                                  <div>
                                    {auction.id_product ===
                                    params.id_product ? (
                                      <section>
                                        <p>You can place your offer</p>
                                        <p>
                                          Starting price:{" "}
                                          {window.web3.utils.fromWei(
                                            product.price,
                                            "Ether"
                                          )}{" "}
                                          Eth
                                        </p>
                                        {!product.auction_ended ? (
                                          <section>
                                            {!props.admin ? (
                                              <form
                                                onSubmit={(event) => {
                                                  event.preventDefault();
                                                  const value =
                                                    window.web3.utils.toWei(
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
                                                    for="bidvalue"
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
                                                  <small class="form-text text-muted">
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
                                            ) : null}
                                          </section>
                                        ) : (
                                          <p>Auction ended</p>
                                        )}
                                        <section>
                                          <h2 className="section-title">
                                            Details:
                                          </h2>
                                          {/* {checkIfEnded(
                                              auction.auctionEndTime,
                                              props,
                                              auction.id_auction
                                            )
                                              ? props.auctionEnd(
                                                  auction.id_auction
                                                )
                                              : null} */}
                                          <Auction key={key} {...auction} />
                                        </section>
                                      </section>
                                    ) : null}
                                  </div>
                                );
                              })}
                            </section>
                          </div>
                        )}
                      </p>
                    </div>
                  </div>
                </section>
              ) : null}
            </div>
          );
        })}
    </div>
  );
};

export default ProductPage;
