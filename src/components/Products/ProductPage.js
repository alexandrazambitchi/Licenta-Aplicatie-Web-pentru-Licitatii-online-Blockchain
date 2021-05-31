import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import AdminControls from "../ProductPage/AdminControls";
// import AuctionControls from "../ProductPage/AuctionControls";
import ProductInfo from "../ProductPage/ProductInfo";
import Auction from "../Products/Auction";

const ProductPage = (props) => {
  const params = useParams();
  const [auctionTimer, setAuction] = useState(0);
  const [endTime, setEndTime] = useState(-1);
  const [disable, setDisable] = useState(false);
  const [endDate, setEndDate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [productFound, setProduct] = useState(null);
  const [auctionFound, setAuctionFound] = useState(null);

  function getAuction() {
    props.auctions.map((auction, key) => {
      if (auction.id_product === params.id_product) {
        setAuctionFound(auction);
      }
    });
  }

  useEffect(() => {
    const timer1 = setTimeout(
      () => setDisable(true),
      endTime * 1000 - Date.now()
    );
    // console.log("timer", timer1 * 1000);
    return () => {
      clearTimeout(timer1);
    };
  }, [auctionTimer]);

  useEffect(() => {
    setLoading(true);
    // console.log("clicked value", clicked);
    async function getProduct() {
      try {
        {
          props.products.map((product, key) => {
            if (product.id_product === params.id_product) {
              {
                props.auctions.map((auction, key) => {
                  if (auction.id_product === params.id_product) {
                    return setAuction(auction);
                  }
                });
              }
              setProduct(product);
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    async function refresh() {
      await getProduct();
      setTimeout(function () {
        window.location.reload();
      }, 60000);
    }
    refresh();
    setClicked(false);
    setLoading(false);
  }, [clicked]);

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
                              setClicked(true);
                              // console.log("clicked...", clicked);
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
                            setClicked(true);
                            // console.log("clicked...", clicked);
                          }}
                        >
                          Delete product
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="p-2 flex-grow-1 bd-highlight">
                  {!product.auction_started ? (
                    <p>Auction has not started yet! Coming soon!</p>
                  ) : (
                    <div className="p-2">
                      {!auctionFound ? (
                        getAuction()
                      ) : (
                        <div>
                          {auctionTimer === 0 ? setAuction(auctionFound) : null}
                          {endDate === 0 ? setEndDate(new Date()) : null}
                          {endTime === -1
                            ? setEndTime(auctionFound.auctionEndTime)
                            : null}
                          <h2>Auction started</h2>
                          <p>You can place your offer</p>
                          <p>
                            Starting price:{" "}
                            {window.web3.utils.fromWei(product.price, "Ether")}{" "}
                            Eth
                          </p>
                          {!auctionFound.ended ? (
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
                                      auctionFound.id_auction,
                                      value,
                                      product.id_product
                                    );
                                  }}
                                >
                                  <div className="form-group">
                                    {disable ? (
                                      <h2>
                                        You can no longer place bids. Auction
                                        ends soon.
                                      </h2>
                                    ) : null}
                                    <label className="form-label mt-4">
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
                                      disabled={disable}
                                    />
                                    <small className="form-text text-muted">
                                      Price should be in ethers.
                                    </small>
                                  </div>
                                  <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={disable}
                                    onClick={(event) => {
                                      setClicked(true);
                                      // console.log("clicked...", clicked);
                                    }}
                                  >
                                    Place bid
                                  </button>
                                  <p></p>
                                  {!loading ? setLoading(true) : null}
                                </form>
                              ) : (
                                <div>
                                  {!product.purchased ? (
                                    <section>
                                      <button
                                        className="btn btn-primary"
                                        name={product.id_product}
                                        onClick={(event) => {
                                          props.auctionEnd(
                                            auctionFound.id_auction,
                                            auctionFound.highestBid,
                                            auctionFound.highestBidder
                                          );
                                          setClicked(true);
                                          // console.log("clicked...", clicked);
                                        }}
                                      >
                                        End Auction
                                      </button>
                                    </section>
                                  ) : null}
                                </div>
                              )}
                            </section>
                          ) : (
                            <div>
                              <h1>Auction ended</h1>
                              {console.log(auctionFound.highestBid==0)}
                              {
                                auctionFound.highestBid == 0 ? (
                                <p>No one bid at this auction</p>
                              ) : (
                                <section>
                                  <h3>Product sold</h3>
                                  <p>
                                    Sold for:{" "}
                                    {window.web3.utils.fromWei(
                                      auctionFound.highestBid,
                                      "Ether"
                                    )}{" "}
                                    Eth
                                  </p>
                                </section>
                              )}
                            </div>
                          )}
                          <section>
                            <h2 className="section-title">Details:</h2>
                            <Auction key={key} {...auctionFound} />
                          </section>
                        </div>
                      )}
                    </div>
                  )}
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
