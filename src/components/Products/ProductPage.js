import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import AdminControls from "../ProductPage/AdminControls";
// import AuctionControls from "../ProductPage/AuctionControls";
import ProductInfo from "../ProductPage/ProductInfo";
import Auction from "../Products/Auction";
// import Product from "./Product";

// function getProduct(id){
//   {props.products.map((product, key) => 
//     {product.id_product=== id ? return(product) : null}
//     )}
// }

const ProductPage = (props) => {
  const [auctionTimer, setAuction] = useState(0);
  const [endTime, setEndTime] = useState(-1);
  const [disable, setDisable] = useState(false);
  const [endDate, setEndDate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [productFound, setProduct] = useState(null);
  // console.log(auctionTimer);
  // console.log("initial disable", disable);

  
  
  useEffect(() => {
    const timer1 = setTimeout(
      () => setDisable(true),
      endTime *1000 -Date.now()
    );
    console.log("timer", timer1 * 1000);
    return () => {
      clearTimeout(timer1);
    };
  }, [auctionTimer]);

  useEffect(() => {
    setLoading(true)
    console.log("clicked value", clicked)
    async function getProduct() {
      try {
        {
          props.products.map((product, key) => {
            if (product.id_product === params.id_product) {
              {props.auctions.map((auction, key) => { 
                if (auction.id_product === params.id_product){
                  setAuction(auction);
                }
              })}
              // prod=product
              setProduct(product);
              // setLoading(false);
              console.log("loading: prod ", loading);
              console.log(productFound);
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
  }
  async function refresh(){
    await getProduct();
    setInterval(function () {
      window.location.reload();
    }, 60000);
  }
  // const timer2 = setTimeout(
  //   () =>
  //     function () {
  //       window.location.reload();
  //     },
  //   1000
  // );
  // // console.log("timer", timer1 * 1000);
  // return () => {
  //   clearTimeout(timer2);
  // };
  // await getProduct();
  refresh();
  setClicked(false)
  setLoading(false);
  console.log("loading: ", loading);
}, [clicked])

  // useEffect(() => {
  //   let timer2 = setTimeout(() => setLoading(false), 1000);
  //   console.log("useefect", loading)
  //   return () => {
  //     clearTimeout(timer2);
  //   };
  // }, [loading]);

  const params = useParams();
  // if(loading) {
  //   return (
  //     <div id="loader" className="text-center">
  //       <p className="text-center">Loading...</p>
  //     </div>
  //   );
  // }
  return (
    <div id="content">
      {/* {loading ? (
        <div id="loader" className="text-center">
          <p className="text-center">Loading...</p>
        </div>
      ) : (
        // <p>{setLoading(false)}</p>
        null
      )} */}
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
                          <section>
                            <button
                              className="btn btn-primary"
                              name={product.id_product}
                              onClick={(event) => {
                                props.createAuction(product.id_product);
                                // setLoading(true);
                                // setDisable(false);
                                setClicked(true);
                                console.log("clicked...", clicked)
                              }}
                            >
                              Start Auction
                            </button>
                            {/* <p>{!loading ? setLoading(true) : null}</p> */}
                          </section>
                        ) : (
                          <div>Auction started</div>
                        )}

                        <button
                          className="btn btn-primary"
                          name={product.id_product}
                          onClick={(event) => {
                            props.deleteProduct(product.id_product);
                            setClicked(true);
                            console.log("clicked...", clicked);
                          }}
                        >
                          Delete product
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div>
                  {!product.auction_started ? (
                    <p>
                      Auction has not started yet! Coming soon!
                      {/* {setDisable(false)} */}
                    </p>
                  ) : // <p>{disable ? setDisable(false) : null} </p>
                  null}
                </div>
                <div className="p-2 flex-grow-1 bd-highlight">
                  {props.auctions.map((auction, key) => {
                    return (
                      <div className="p-2">
                        {auction.id_product === params.id_product ? (
                          <div>
                            {/* {auctionTimer === 0 ? setDisable(false) : null} */}
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
                            {/* {console.log("endtime", endTime)}
                            {console.log("now", Math.floor(Date.now() / 1000))} */}
                            {/* {console.log("auction timer", auctionTimer)} */}
                            {/* {console.log(
                              Math.floor(Date.now() / 1000) - endTime
                            )} */}
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
                                      {disable ? (
                                        <p>
                                          You can no longer place bids. Auction
                                          ends soon.
                                        </p>
                                      ) : null}
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
                                        // setLoading(true);
                                        // console.log(loading);
                                        setClicked(true)
                                        console.log("clicked...", clicked);
                                      }}
                                    >
                                      Place bid
                                    </button>
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
                                              product.id_auction,
                                              auction.highestBid,
                                              auction.highestBidder
                                            );
                                            // setLoading(true);
                                            setClicked(true);
                                            console.log("clicked...", clicked);
                                          }}
                                        >
                                          End Auction
                                        </button>
                                        {/* {!loading ? setLoading(true) : null} */}
                                      </section>
                                    ) : null}
                                  </div>
                                )}
                              </section>
                            ) : (
                              <h1>Auction ended</h1>
                            )}
                            <section>
                              <h2 className="section-title">Details:</h2>
                              {/* {console.log(
                                auction.ended,
                                product.purchased,
                                auction.highestBid
                              )} */}
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
