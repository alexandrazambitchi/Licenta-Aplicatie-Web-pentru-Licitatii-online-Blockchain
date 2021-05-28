import React from "react";
// import { Link } from "react-router-dom";
import "../App.css";
// import { format } from "date-fns"
// import Countdown from "../Products/Countdown"

// import {auctionEnd} from "../App"
export default function Auction({
  id_auction, clients, offerCount, highestBid, id_product, highestBidder
}) {
  // var date = moment({ auctionEndTime } * 1000).format("DD/MM/YYYY");
  // let endDate = new Date(auctionEndTime*1000)
  return (
    <article className="auction">
      <div className="auction-footer">
        {/* <p>Auction Ends: {format(endDate, "dd/MM/yyyy")}</p> */}
        {/* <div>
          Time left to place offer: <Countdown date={String(endDate)} />{" "}
        </div> */}
        <p>Number of offers until now: {offerCount}</p>
        <p>Highest bid: {window.web3.utils.fromWei(highestBid, "Ether")} Eth</p>
        <p>Highest bidder: {highestBidder}</p>
      </div>
    </article>
  );
}