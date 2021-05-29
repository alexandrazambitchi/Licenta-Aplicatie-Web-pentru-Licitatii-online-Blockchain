import React from "react";
import { useParams, Link } from "react-router-dom";
import AdminControls from "../ProductPage/AdminControls";
import AuctionControls from "../ProductPage/AuctionControls";
import ProductInfo from "../ProductPage/ProductInfo";
import Auction from "../Products/Auction";
import Product from "./Product"
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
// function validateBid(value, price){
  //   const errors=[]
  //   if(value<=price){
  //     errors.push("Value too little")
  //   }
  //   return errors;
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
                <div className="d-flex">
                  <div className="p-2 flex-grow-1 bd-highlight">
                    <h2 className="section-title">{product.name}</h2>
                    <ProductInfo key={key} {...product} text={"Back home"} />
                    <div className="p-2 text-left">
                      {props.admin ? (
                        <div>
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
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div>
                    {!product.auction_started ? (
                      <p>Auction has not started yet! Coming soon!</p>
                    ) : null}
                  </div>
                  <div className="p-2 flex-grow-1 bd-highlight">
                    {props.auctions.map((auction, key) => {
                      return (
                        <div className="p-2">
                          {auction.id_product === params.id_product ? (
                            <div>
                              <p>Auction started</p>
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
                                  ) : null}
                                </section>
                              ) : (
                                <p>Auction ended</p>
                              )}
                              <section>
                                <h2 className="section-title">Details:</h2>
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
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
    </div>
  );
};

export default ProductPage;
