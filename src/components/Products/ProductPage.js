import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import AdminControls from "../ProductPage/AdminControls";
// import AuctionControls from "../ProductPage/AuctionControls";
import ProductInfo from "../ProductPage/ProductInfo";
import Auction from "../Products/Auction";

const ProductPage = (props) => {
  const params = useParams();
  const [auctionTimer, setAuction] = useState(0);
  const [targetHit, setTarget] = useState(false);
  const [endTime, setEndTime] = useState(-1);
  const [disable, setDisable] = useState(false);
  const [disableSent, setDisableSent] = useState(false);
  const [endDate, setEndDate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [productFound, setProduct] = useState(null);
  const [auctionFound, setAuctionFound] = useState(null);
  const [artistName, setArtist] = useState(null);
  const [moneySent, setMoney] = useState(false);
  // const [sell, setSell] = useState(false);
  const [page, reload] = useState(false);

  function getArtist(id_artist) {
    console.log("Searching the artist");
    props.artists.map((artist) => {
      if(artist.id_artist === id_artist){
        setArtist(artist);
      }
    }
    )
  }

  function getAuction() {
    props.auctions.map((auction, key) => {
      if (auction.id_product === params.id_product) {
        console.log(auction.offerCount)
        setAuctionFound(auction);
      }
    });
  }

  function isTargetHit(){
    if(auctionFound.highestBid >= auctionFound.target_price){
      console.log("target", targetHit)
      setTarget(true);
    }
  }

  useEffect(() => {
    setTarget(false);
    setDisable(false);
    setClicked(false);
    setDisableSent(false);
  }, [params])

  useEffect(() =>{
    console.log("disable sent", disableSent)
    setDisableSent(true);
    console.log("disable sent after", disableSent);
  }, [moneySent])

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
    setDisable(true)
  }, [targetHit]);

  useEffect(() => {
    setLoading(true);
    // console.log("clicked value", clicked);
    async function getProduct() {
      try {
          props.products.map((product, key) => {
            if (product.id_product === params.id_product) {
                props.auctions.map((auction, key) => {
                  if (auction.id_product === params.id_product) {
                    return setAuction(auction);
                  }
                });
              setProduct(product);
            }
          });
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
                  {!artistName ? (
                    getArtist(product.id_artist)
                  ) : (
                    <ProductInfo
                      key={key}
                      {...product}
                      artist={artistName.artist_name}
                    />
                  )}
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
                              reload(!page);
                            }}
                          >
                            Start Auction
                          </button>
                        ) : (
                          <div>
                            {!auctionFound ? (
                              getAuction()
                            ) : (
                              <div>
                                {auctionFound.offerCount === "0" ? (
                                  <form
                                    onSubmit={(event) => {
                                      event.preventDefault();
                                      const value = window.web3.utils.toWei(
                                        this.newTarget.value.toString(),
                                        "Ether"
                                      );
                                      props.editAuction(
                                        auctionFound.id_auction,
                                        value
                                      );
                                    }}
                                  >
                                    <div className="form-group">
                                      <label className="form-label mt-4">
                                        New target price
                                      </label>
                                      <input
                                        id="newTarget"
                                        type="text"
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
                                    <button
                                      type="submit"
                                      className="btn btn-primary"
                                      onClick={(event) => {
                                        setClicked(true);
                                        reload(!page);
                                        // console.log("clicked...", clicked);
                                      }}
                                    >
                                      Change target price
                                    </button>
                                    <p></p>
                                    {!loading ? setLoading(true) : null}
                                  </form>
                                ) : null}
                              </div>
                            )}
                          </div>
                        )}
                        <button
                          className="btn btn-primary"
                          name={product.id_product}
                          onClick={(event) => {
                            props.deleteProduct(product.id_product);
                            setClicked(true);
                            reload(!page);
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
                                <div>
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
                                      reload(!page);
                                    }}
                                  >
                                    <div className="form-group">
                                      {disable ? (
                                        <h2>
                                          You can no longer place bids. Auction
                                          ends soon.
                                        </h2>
                                      ) : null}
                                      {targetHit ? (
                                        <h3>Target price was hit!</h3>
                                      ) : null}
                                      {disable && !targetHit ? (
                                        <h3>Time to place bets ended</h3>
                                      ) : null}
                                      {console.log("target hit", targetHit)}
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
                                        reload(!page);
                                        // console.log("clicked...", clicked);
                                      }}
                                    >
                                      Place bid
                                    </button>
                                    <p></p>
                                    {!loading ? setLoading(true) : null}
                                    {!targetHit ? isTargetHit() : null}
                                  </form>
                                  {!auctionFound.moneySent && targetHit ? (
                                    <button
                                      className="btn btn-primary"
                                      disabled={disableSent}
                                      onClick={(event) => {
                                        props.sendValue(
                                          auctionFound.highestBid,
                                          auctionFound.id_auction
                                        );
                                        setClicked(true);
                                        console.log(moneySent);
                                        setMoney(true);
                                        setDisableSent(true);
                                        console.log(moneySent);
                                        console.log("clicked...", clicked);
                                        reload(!page);
                                      }}
                                    >
                                      Send money!
                                    </button>
                                  ) : null}
                                </div>
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
                                          reload(!page);
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
                              {console.log(auctionFound.highestBid === 0)}
                              {auctionFound.highestBid === 0 ? (
                                <p>No one bid at this auction</p>
                              ) : (
                                <section>
                                  {!targetHit ? (
                                    <h3>No one bid above the target price</h3>
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
