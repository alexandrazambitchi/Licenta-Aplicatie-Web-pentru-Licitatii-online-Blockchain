import React from "react";

const Info = () => {
  return (
    <section className="section about-section">
      <h1 className="section-title">About us</h1>
      <p>
        The auctions on this website use Blockchain tehnology, meaning that the data about artists and products is stored in blocks. Also the tranzactions are made using Ether. Information about the tranzactions are also stored in Blockchain.
      </p>
      <h2>Why Blockchain?</h2>
      <p>The Blockchain offers security and transparency, so anyone can have access to the data stored in blocks. The data is encrypted. Any modification made to the information existing in blocks does not replace it, but a new block with the new data is created. This offers a complete history of the modifications and prevents frauds.</p>
      <h2>How to bid?</h2>
      <p>There are two types of auctions combined:</p>
      <ul>
        <li>English auction - increased value</li>
        <li>Target price</li>
      </ul>
      <p>When an auction for a product is started, any client has 10 days to place their offer.</p>
      <p>If the target price, which is automatically set at double the starting price, is hit, the auction no longer accepts bids and the client that bid above the target price can send the Ethers and become the new owner. The auction officially ends when the owner checks if the transfer was made correctly.</p>
      <p>In case no one bids above the target price and the auction time ends, but there is at least a bid, the owner can decide if the highest bidder can be the winner of the auction.</p>
      <p>If no one bids during the auction, the auction ends without any winners.</p>
      <h3>What is Blockchain?</h3>
    </section>
  );
};

export default Info;
