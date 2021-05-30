import React from "react";
// import { Link } from "react-router-dom";
import "../App.css";
import { format } from "date-fns";
import Countdown from "./Countdown";
// import {auctionEnd} from "../components/App"
export default function Auction({
  id_auction,
  auctionEndTime,
  clients,
  offerCount,
  highestBid,
  id_product,
  ended
}) {
  // var date = moment({ auctionEndTime } * 1000).format("DD/MM/YYYY");
  let endDate = new Date(auctionEndTime * 1000);
  return (
    <article className="auction">
      <div className="auction-footer">
        <p>Auction Ends: {format(endDate, "dd/MM/yyyy")}</p>
        {/* <p>Auction Ends: {auctionEndTime}</p> */}
        {!ended ? (
          <div>
            Time left to place offer: <Countdown date={String(endDate)} />{" "}
          </div>
        ) : null}

        <p>Number of offers: {offerCount}</p>
        <p>Highest bid: {window.web3.utils.fromWei(highestBid, "Ether")} Eth</p>
      </div>
    </article>
  );
}
