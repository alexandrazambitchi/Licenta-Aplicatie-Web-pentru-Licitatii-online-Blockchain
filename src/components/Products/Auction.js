import React from "react";
import "../App.css";
import { format } from "date-fns";
import Countdown from "./Countdown";
export default function Auction({
  auctionEndTime,
  offerCount,
  highestBid,
  ended,
  target_price,
  admin,
}) {
  let endDate = new Date(auctionEndTime * 1000);
  return (
    <article className="auction">
      <div className="auction-footer">
        {admin ? (
          <p>
            Target price: {window.web3.utils.fromWei(target_price, "Ether")} Eth
          </p>
        ) : null}
        <p>Register bids until: {format(endDate, "dd/MM/yyyy")}</p>
        {!ended ? (
          <div>
            Time left to place offer: <Countdown date={String(endDate)} />{" "}
          </div>
        ) : null}

        <p>Number of offers: {offerCount}</p>
        <p>{window.web3.utils.fromWei(highestBid, "Ether")} Eth</p>
      </div>
    </article>
  );
}
