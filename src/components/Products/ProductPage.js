import React, { useState, useEffect } from "react";
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
  const [auctionTimer, setAuction] = useState(0)
  const [endTime, setEndTime] = useState(-1)
  const [disable, setDisable] = useState(false)
  const [endDate, setEndDate] = useState(0)
  console.log(auctionTimer)
  // useEffect(() => {
  //   let endDate = auctionTimer.auctionEndTime;
  //   console.log("date", endDate)
  //   console.log("props", props)
  //   let timer1 = setTimeout(() => props.auctionEnd(auctionTimer.id_auction), 3600000);
  //   console.log("timer", timer1*1000)
  //   return () => {
  //     clearTimeout(timer1);
  //   };
  // }, [auctionTimer]);

  useEffect(() => {
    let timer1 = setTimeout(
      () => setDisable(true),
      endTime - Math.floor(Date.now() / 1000)
    );
    console.log("timer", timer1 * 1000);
    return () => {
      clearTimeout(timer1);
    };
  }, [auctionTimer]);
  
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
                          {!product.purchased ? (
                            <button
                              className="btn btn-primary"
                              name={product.id_product}
                              onClick={(event) => {
                                props.auctionEnd(product.id_auction);
                              }}
                            >
                              End Auction
                            </button>
                          ) : null}
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
                              {auctionTimer === 0 ? setAuction(auction) : null}
                              {endDate === 0 ? setEndDate(new Date()) : null}
                              {endTime === -1
                                ? setEndTime(
                                    // Date(auction.auctionEndTime * 1000)
                                    auction.auctionEndTime
                                  )
                                : null}
                              {/* {endTime === Math.floor(Date.now() / 1000) &&
                              disable === false
                                ? setDisable(true)
                                : null} */}
                              {console.log("endtime", endTime)}
                              {console.log(Math.floor(Date.now() / 1000))}
                              {console.log(auctionTimer)}
                              {console.log(Math.floor(Date.now() / 1000) - endTime)}
                              {console.log("disable", disable)}
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
                              {!auction.ended ? (
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
                                        disabled={disable}
                                      >
                                        Place bid
                                      </button>
                                    </form>
                                  ) : null}
                                </section>
                              ) : (
                                <h1>Auction ended</h1>
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
                                {console.log(
                                  auction.ended,
                                  product.purchased,
                                  auction.highestBid
                                )}
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
